import { Injectable } from '@nestjs/common';
// import { FindConditions } from 'typeorm';

import { PageDto } from '../../common/dto/PageDto';
import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import { IFile } from '../../interfaces/IFile';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UserDto } from './dto/UserDto';
import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserUpdateDto } from './dto/userUpdateDto';
import { RoleType } from '../../common/constants/role-type';

@Injectable()
export class UserService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly validatorService: ValidatorService,
    public readonly awsS3Service: AwsS3Service,
  ) { }

  /**
   * Find single user
   */
  // findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
  findOne(findData: any): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: findData,
      relations: ['socio', 'cliente'],
    });
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | undefined> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }
    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  async createUser(userRegisterDto: UserRegisterDto, file: IFile): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      // user.avatar = await this.awsS3Service.uploadImage(file);
    }

    return await this.userRepository.save(user);
  }
  async createWithRole(userRegisterDto: UserRegisterDto, role: RoleType) {

    const user = this.userRepository.create({ ...userRegisterDto, role });

    return this.userRepository.save(user);
  }

  async create(userRegisterDto: UserDto) {
    const user = this.userRepository.create(userRegisterDto);

    return this.userRepository.save(user);
  }

  // async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
  async getUsers(pageOptionsDto: UsersPageOptionsDto) {
    // const queryBuilder = this.userRepository.createQueryBuilder('user');
    // const { items, pageMetaDto } = await queryBuilder.paginate(pageOptionsDto);

    // return items.toPageDto(pageMetaDto);
    const queryBuilder = await this.userRepository.find();
    return queryBuilder;
  }

  async getByEmail(email: string): Promise<UserEntity> {
    // const queryBuilder = this.userRepository.createQueryBuilder('user');

    // queryBuilder.where('user.email = :email', { email });
    // queryBuilder.relation('cliente');

    // const userEntity = await queryBuilder.getOne();
    // return userEntity;
    const socios = await this.userRepository.findOne({
      where: { email: email },
      relations: ['cliente', 'socio'],
    });

    return socios;
  }

  async getUser(userId: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    return userEntity.toDto();
  }

  async findAll() {
    const users = await this.userRepository.find({ order: { createdAt: 'ASC', role: 'ASC' } });
    return users;
  }

  async remove(id: string) {
    const users = await this.userRepository.find({ where: { id: id } });
    return await this.userRepository.remove(users);
  }

  async updateActive(id: string) {
    console.log('user id ', id);
    const consultorio = await this.userRepository.findOneBy({ id });
    if (!consultorio.id) {
      // tslint:disable-next-line:no-console
      console.error("Todo doesn't exist");
    }
    await this.userRepository.update(id, { activo: !consultorio.activo });
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateConsultorioDto: UserUpdateDto) {
    const userupdate = await this.userRepository.findOneBy({ id });
    if (!userupdate.id) {
      // tslint:disable-next-line:no-console
      console.error("Todo doesn't exist");
    }
    await this.userRepository.update(id, updateConsultorioDto);
    return await this.userRepository.findOneBy({ id });
  }
}

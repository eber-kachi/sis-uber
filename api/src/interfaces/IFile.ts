'use strict';

export interface IFile {
  encoding: string;
  buffer: Buffer;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  size: number;
}

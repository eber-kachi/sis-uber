'use strict';
export enum EstadoViaje {
  PENDIENTECONFIRMACION = 'pendiente_confirmacion',
  CONFIRMADO = 'confirmado',
  ENPROGRESO = 'en_progreso',
  FINALIZADO = 'finalizado',
  CanceladoUsuario = 'cancelado_usuario',
  CanceladoConductor = 'cancelado_conductor',
  CanceladoSistema = 'cancelado_sistema',
}

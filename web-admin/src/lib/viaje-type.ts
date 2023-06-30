

export enum EstadoViaje {
  PENDIENTECONFIRMACION = 'pendiente_confirmacion',
  CONFIRMADO = 'confirmado',
  ENPROGRESO = 'en_progreso',
  FINALIZADO = 'finalizado',
  CanceladoUsuario = 'cancelado_usuario',
  CanceladoConductor = 'cancelado_conductor',
  CanceladoSistema = 'cancelado_sistema',
}

export enum StateHandlerEvents {
  VIAJEPENDIENTECONFIRMACIONEVENTO = 'viaje_pendiente_confirmacion_evento',
  SOCIOACTIVOEVENTO = 'socio_activo_evento',
  SOCIOINACTIVOEVENTO = 'socio_inactivo_evento',
}

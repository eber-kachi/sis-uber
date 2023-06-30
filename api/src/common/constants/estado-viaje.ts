'use strict';

export enum EstadoViaje {
  PENDIENTECONFIRMACION = 'pendiente_confirmacion',
  PENDIENTECONFIRMACIONSOCIO = 'pendiente_confirmacion_socio',
  CONFIRMADO = 'confirmado',
  ENPROGRESO = 'en_progreso',
  INICIANDOVIAJE = 'iniciando_viaje',
  FINALIZADO = 'FINALIZADO',
  CanceladoUsuario = 'cancelado_usuario',
  CanceladoConductor = 'cancelado_conductor',
  CanceladoSistema = 'cancelado_sistema',
}

export enum StateHandlerEvents {
  VIAJEPENDIENTECONFIRMACIONEVENTO = 'viaje_pendiente_confirmacion_evento',
  SOCIOACTIVOEVENTO = 'socio_activo_evento',
  SOCIOINACTIVOEVENTO = 'socio_inactivo_evento',
}

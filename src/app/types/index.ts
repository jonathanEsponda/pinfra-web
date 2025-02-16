// Perfiles
export interface perfilModel {
  id: number;
}

export interface PerfilModelResponse {
  id: number;
  nombre: string;
  activo: boolean;
  idFuncionalidades: number[];
}

// Instituciones
export interface InstitucionModelResponse {
  id: number;
  nombre: string;
  activo: boolean;
}

// Telefonos
export interface TelefonoModelResponse {
  id: number;
  telefono: string;
  idUsuario: boolean;
}

// Marcas
export interface MarcaModelResponse {
  id: number;
  nombre: string;
  activo: boolean;
}

// Modelos
export interface ModeloModelResponse {
  id: number;
  nombre: string;
  idMarca: number;
  activo: boolean;
}

// Paises
export interface PaisModelResponse {
  id: number;
  nombre: string;
  activo: boolean;
}

// Proveedores
export interface ProveedorModelResponse {
  id: number;
  nombre: string;
  activo: boolean;
}

// Tipos Equipo
export interface TipoEquipoModelResponse {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface TipoEquipoModelrequest {
  nombre: string;
}

// Ubicaciones
export interface UbicacionModelResponse {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface ImagenEquipo {
  equipoId: string;
  data: string;
}

// Equipos
export interface EquipoModelResponse {
  id: number;
  nombre: string;
  idTipoEquipo: number;
  idMarca: number;
  idModelo: number;
  numSerie: string;
  idPaisOrigen: number;
  idProveedor: number;
  fechaAdquisicion: string;
  garantia: GarantiaModel;
  garantiaAnios: number;
  idUbicacionActual: number;
  idBajaEquipo?: number;
  fechaExpiracionGarantia: string;
  nombreTipoEquipo?: string;
  nombreMarca?: string;
  nombreModelo?: string;
  nombrePais?: string;
  nombreProveedor?: string;
  nombreUbicacion?: string;
  activo?: boolean;
}

export interface EquipoFiltroFormData {
  id?: string;
  nombre?: string;
  idTipoEquipo?: string;
  idMarca?: string;
  idModelo?: string;
  numSerie?: string;
  idPaisOrigen?: string;
  idProveedor?: string;
  fechaAdquisicionDesde?: string;
  fechaAdquisicionHasta?: string;
  idUbicacionActual?: string;
  activo?: string; // Puede ser "true", "false" o ""
}

export interface EquipoCardProps {
  equipo: EquipoModelResponse;
}

// Registrar un nuevo equipo
export interface RegistroEquipoModel {
  nombre: string;
  idTipoEquipo: string;
  idMarca: string;
  idModelo: string;
  numSerie: string;
  idPaisOrigen: string;
  idProveedor: string;
  fechaAdquisicion: string;
  garantia: GarantiaModel;
  idUbicacionActual: string;
  idBajaEquipo: string;
  fechaExpiracionGarantia: string;
  imagen?: FileList;
}

// La interfaz del formulario extiende RegistroEquipoModel, pero reemplaza
// la propiedad "garantia" por la versión extendida con el campo "tipo" y
// agrega el campo idMarca que solo se utiliza en el formulario.
export interface RegistroEquipoFormModel
  extends Omit<RegistroEquipoModel, "garantia"> {
  garantia: GarantiaFormModel;
}

export interface ModificarEquipoModel {
  id: number;
  nombre: string;
  idTipoEquipo: string;
  idMarca: string;
  idModelo: string;
  numSerie: string;
  idPaisOrigen: string;
  idProveedor: string;
  fechaAdquisicion: string;
  garantia: GarantiaModel;
  idUbicacionActual: string;
  idBajaEquipo: string;
  fechaExpiracionGarantia: string;
}

export interface FiltroEquipoModel {
  id?: number;
  nombre?: string;
  tipoEquipo?: string;
  marca?: string;
  modelo?: string;
  numSerie?: string;
  paisOrigen?: string;
  proveedor?: string;
  fechaAdquisicionDesde?: string;
  fechaAdquisicionHasta?: string;
  ubicacionActual?: string;
  activo?: boolean;
}

export interface BajaEquipoModel {
  fecha: string;
  razon: string;
  comentarios: string;
  idUsuario: number;
  idEquipo: number;
}

export interface BajaEquipoFormModel extends BajaEquipoModel {
  nombre: string;
}

// Garantia
export interface GarantiaModel {
  anios: number;
  meses: number;
  dias: number;
  dePorVida: boolean;
}
// Interfaz extendida para el formulario que agrega el campo "tipo"
// para controlar la selección de garantía de por vida o duración ingresada.
export interface GarantiaFormModel extends GarantiaModel {
  // "lifetime": Garantía de por vida, "duration": Ingresar duración
  tipo: "lifetime" | "duration";
}

// Marcas
export interface MarcaModel {
  idModelo: number;
}

export interface UsuarioFiltroFormData {
  id?: string;
  cedula?: string;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  nombreUsuario?: string;
  email?: string;
  idPerfil?: string;
  idInstitucion?: string; // El ID de la institución es un string en el formulario
  activo?: string; // Se usa "true", "false" o "" en los radio buttons
  estado?: string;
}

// Registro de Usuario
export interface UsuarioModel {
  cedula: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  nombreUsuario: string;
  email: string;
  idPerfil: string;
  idInstitucion: string;
}

//Modificar datos personales
export interface UsuarioModelEditarDatosPersonales extends UsuarioModel {
  id: number;
  activo: boolean;
  estado: string;
  contrasenia: string;
  telefono: string;
}

export interface AltaUsuarioModel {
  usuario: UsuarioModel;
  contrasenia: string;
  telefono: string;
}

export interface AltaUsuarioFormModel extends AltaUsuarioModel {
  confirmarContrasenia: string;
}

export interface UsuarioModelResponse extends UsuarioModel {
  id: number;
  activo: boolean;
  estado: string;
  nombrePerfil?: string;
  nombreInstitucion?: string;
}

export interface UsuarioModelByIdAndModify extends UsuarioModel {
  id: number;
  activo: boolean;
  estado: string;
  contrasenia?: string;
}

export interface UsuarioModelByIdAndModifyWithPhone
  extends UsuarioModelByIdAndModify {
  telefono?: string;
}

//Login de usuario
export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuarioDTORest: {
    id: number;
    cedula: number;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    fechaNacimiento: string;
    nombreUsuario: string;
    email: string;
    idPerfil: number;
    idInstitucion: number;
    activo: boolean;
    estado: string;
  };
}

export interface FiltroUsuarioModel {
  id?: number;
  cedula?: string;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  nombreUsuario?: string;
  email?: string;
  perfil?: string;
  institucion?: number;
  activo?: boolean;
  estado?: string;
}

import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuarios-lista';
import { Usuario } from "../classes/usuario";

export const usuariosConectados = new UsuarioLista();


export const conectarCliente = ( cliente: Socket ) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
};


export const desconectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuario(cliente.id);
        console.log('Cliente Desconectado');
    });
}

//Escuchar Mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: any) => {
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);
    });
}

//Configurar Usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload: {nombre: string}, callback: Function) => {
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre);
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
    });
}
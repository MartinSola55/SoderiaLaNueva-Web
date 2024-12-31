export class Messages {
    static Error = {
        403: 'No tienes permisos para realizar esta acción.',
        404: 'No se ha encontrado la información solicitada.',
        500: 'Ha ocurrido un error inesperado en el servidor.',
        generic: 'Ha ocurrido un error inesperado.',
        noRows: 'No se han encontrado registros que coincidan con los filtros aplicados.',
        notAllowed: 'No tienes permisos para ver esta página.',
    }
    static Validation = {
        requiredFields: 'Por favor, complete todos los campos obligatorios.',
        passwordCheck: 'La contraseña debe ser la misma en ambos campos',
        amountGreaterThanZero: 'El monto debe ser superior a cero.',
    };
}


class Usuarios{

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala){

        let persona = {id, nombre, sala};
        this.personas.push(persona);
        return this.personas;
    }
    getPersonaById(id){
        let persona = this.personas.filter(persona => persona.id === id )[0];
        return persona;
    }

    getPersonas(){
        return this.personas;
    }
    getPersonasPorSala(sala){
        let personasEnSala = this.personas.filter(persona =>  persona.sala === sala );
        return personasEnSala;
    }
    deletePersona(id){
        let personaBorrada = this.getPersonaById(id);
        this.personas = this.personas.filter( persona => persona.id != id );
        return personaBorrada;
    }


}

module.exports = {
    Usuarios
}
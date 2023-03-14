# Commit assistant

Este es un proyecto para ayudarte a crear commits semánticos para tu repositorio de Git. El proyecto incluye una serie de tipos de commits predefinidos que se ajustan a las convenciones de los commits semánticos. También utiliza una serie de dependencias como `picocolors` y `@clack/prompts` para proporcionar una interfaz de línea de comando interactiva para el usuario.

## Requisitos
- Node.js (versión 14 o superior)

## Instalación
- Instala el paquete: `npm i -g gcmt@latest`
- Uso sin instalacion: `npx gcmt@latest`

## Uso
Para usarlo, puedes hacerlo únicamente ejecutando `npx gcmt`, ya que está publicado en [npm](www.npmjs.com). Esto iniciará una serie de comandos interactivos que te guiarán a través del proceso de crear un commit semántico.

### **Tipos de commit**
El proyecto incluye los siguientes tipos de commit predefinidos:

- **feat**: 🆕 Añadir una nueva característica.
- **fix**: 🐛 Corregir un bug.
- **perf**: ⚡ Mejorar el rendimiento.
- **refactor**: 🛠 Refactorizar código.
- **style**: 🖌️ Cambios en el estilo o formato del código.
- **docs**: 📚 Añadir o actualizar documentación.
- **test**: 🧪 Añadir o actualizar pruebas.
- **build**: 🏗️ Añadir o actualizar scripts de construcción.

### **Confirmación**
Antes de crear el commit, el proyecto te pedirá que confirmes la información que has introducido. Asegúrate de revisar cuidadosamente el mensaje del commit antes de confirmar.

## Validación del repositorio remoto y opción de hacer push
Al ejecutar el comando gcmt, se realiza una validación del repositorio remoto actual y se verifica que esté configurado correctamente. Si no se cumple con los requisitos necesarios, el script arrojará un error.

Además, si el repositorio remoto está configurado correctamente, se mostrará un mensaje preguntando si deseas realizar un push para subir tus cambios al repositorio remoto.

En caso de que desees hacer push, deberás confirmar la acción, seguido de la tecla Enter. Si no deseas hacer push, simplemente presiona Enter para salir del script.

**Es importante tener en cuenta que hacer push a un repositorio remoto puede modificar su estado y afectar el trabajo de otros colaboradores, por lo que se recomienda utilizar esta opción con cuidado y solo cuando sea necesario.**

## Contribuciones
Este proyecto está abierto a contribuciones. Si tienes alguna sugerencia o mejora, por favor abre un issue o envía una pull request en [**MI REPOSITORIO**](https://github.com/drummes12/gcmt)

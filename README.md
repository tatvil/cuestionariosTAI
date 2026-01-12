
# Cuestionarios TAI
Este proyecto contiene cuestionarios interactivos para la preparación de oposiciones al **Cuerpo de Técnicos Auxiliares de Informática (TAI)**. Los cuestionarios están organizados por convocatoria y se almacenan en archivos **JSON** para facilitar su mantenimiento y ampliación.

## Características
- **Frontend puro**: No requiere backend ni base de datos.
- **Diseño modular**: HTML, CSS y JavaScript separados.
- **Carga dinámica de cuestionarios**: Los datos se obtienen desde archivos JSON.
- **Organización por convocatorias**: Cada examen se guarda en un fichero independiente.

## Estructura del proyecto

```bash 
/cuestionariosTAI
│
├── index.html              # Página principal
├── /css                    # Estilos
│   └── estilos.css
├── /js                     # Scripts
│   └── app.js
├── /data                   # Archivos JSON con los cuestionarios
|   ├── TAI_2024A.json
│   ├── TAI_2024B.json
│   ├── TAI_2023.json
|   |   TAI_2019.json
│   └── ...
└── /img                    # Imágenes (opcional)
```

## Cómo usar el proyecto
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tatvil/cuestionariosTAI.git
   ```

2. Abre index.html en tu navegador.
3. Asegúrate de que los archivos JSON están en la carpeta /data y que el script app.js los carga correctamente.


### Formato del JSON
Cada archivo contiene un array de preguntas con la siguiente estructura:

 ```bash
[
  {
    "id": 1,
    "pregunta": "Texto de la pregunta",
    "opciones": {
      "a": "Opción A",
      "b": "Opción B",
      "c": "Opción C",
      "d": "Opción D"
    },
    "correcta": "a",
    "examen": "TAI 2024B"
  }
]
```

Ejemplo real (del fichero TAI_2024B.json):

```bash
{
  "id": 1,
  "pregunta": "Señale la respuesta INCORRECTA de acuerdo con el Título II, artículo 62 de la Constitución Española de 1978. Corresponde al Rey:",
  "opciones": {
    "a": "Convocar a referéndum en los casos previstos en la Constitución, previa autorización de las Cortes Generales.",
    "b": "Convocar y disolver las Cortes Generales y convocar elecciones en los términos previstos en la Constitución.",
    "c": "Proponer el candidato a Presidente de Gobierno y, en su caso, nombrario, así como poner fin a sus funciones en los términos previstos en la Constitución.",
    "d": "Nombrar y separar a los miembros del Gobierno, a propuesta de su Presidente."
  },
  "correcta": "a",
  "examen": "TAI 2024B"
}
```

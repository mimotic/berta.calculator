# Suplementos

Datos revisados el 9 de noviembre de 2026. Las etiquetas contrastadas prevalecen sobre fichas web de otras versiones. Las fuentes y limitaciones de cada producto están enlazadas en `src/data/supplements.ts` y visibles en su ficha dentro de la aplicación.

## Unidades

- V-Integra Renal, Dialix Lespedeza Plus 5 y Complivit: gramos. No hay peso por chew verificable para Dialix; no se usa una conversión de otra presentación.
- Adiva B+Biotic Small: chews de 1 g. Adiva Gastric Small: chews de 2 g y 5,79 kcal por chew. Los pesos se corroboran con las cantidades por chew y por kg de las etiquetas.
- Nutratop Gastro Plus e IRC Vet Gel: ml. No se presupone densidad de 1 g/ml.
- Condrovet Force HA para perros y Prolivet Small: comprimidos. No se deduce su peso sumando activos.

Las fracciones se conservan en las cantidades guardadas. Los límites de los controles son límites de interfaz, independientes del objetivo calórico; no son recomendaciones de dosis. Debe introducirse la cantidad indicada por el veterinario.

## Bases nutricionales y datos parciales

El modelo anterior usa nutrientes por 100 g y `portion.grams` para porciones de peso conocido. `measure` añade una base explícita por ml o comprimido. `ingredientNutritionFactor` aplica esa base sin pasar por una masa inventada. El peso total se marca parcial si falta masa o densidad.

- `declaredNutrients`: nutrientes con cantidades publicadas y comparables a las unidades de la aplicación. Los ceros de los otros campos son valores internos, no ausencia del nutriente.
- `partialNutrients`: aportaciones de aditivos que no constituyen un análisis total del producto.
- `nutrientNotes`: cantidades que no se convierten sin información adicional, como vitamina E en UI sin forma química y sales vitamínicas.
- `missingNutrients`: nutrientes cuyo total es desconocido en una ración. Se conservan las sumas conocidas, se identifican como parciales y se desactivan valoraciones, cocientes y diferencias que requieren datos completos.

Los quelantes y otros efectos alegados de los suplementos no restan fósforo ni otros nutrientes de la dieta calculada. Los pesos de carbonato cálcico, acetato cálcico o sorbato potásico no equivalen a calcio o potasio elemental. No se convierte glicina o colágeno en proteína bruta, ni compuestos de fibra en fibra total.

## Diferencias de versión relevantes

- V-Integra: etiqueta con cenizas 62,5 % y K3 MSB 10 mg/kg; la web publica cifras diferentes. K3 no se calcula.
- IRC Vet Gel: fórmula actual con taurina. Se suman únicamente potasio, B6, folato y B12 confirmados por ml. No se reutilizan las calorías, macros ni densidad de una fórmula antigua sin taurina.
- Complivit: etiqueta italiana con 4720 kcal/kg. Sus aditivos por kg prevalecen sobre la ficha española de 2022. E está en UI y no se convierte a mg sin forma química; B1 y B6 declaradas como sales se muestran sin equipararlas a vitamina pura. Los minerales añadidos se identifican como aportaciones parciales.
- Nutratop: ficha y etiqueta coincidentes. Se descarta el análisis de una tienda copiado de Vetgastril. Sin valores nutricionales totales verificables, sirve para registrar la cantidad y consultar su composición.
- Condrovet: variante regular para perros confirmada por etiqueta, no la de razas grandes ni gatos. Envase de 240 g netos sin número de comprimidos confirmado; sigue sin conversión a gramos. Prolivet: variante Small con Oxomet.

## Comprobación

`npm test` incluye conversiones por unidad, cantidades fraccionarias, valores de las etiquetas, datos desconocidos, persistencia y renderizado de componentes. `npm run build` comprueba TypeScript y la compilación; `npm run lint` comprueba estilo y errores estáticos. `npm run test:e2e` cubre selección, edición, persistencia y escritura decimal en escritorio y móvil oscuro. Listar o compilar las pruebas no equivale a ejecutarlas en navegador.

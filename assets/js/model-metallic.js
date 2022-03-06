const modelViewerParameters = document.querySelector("model-viewer");

modelViewerParameters.addEventListener("load", (ev) => {

    let materials = modelViewerParameters.model.materials;

    let metalnessDisplay = document.querySelector("#metalness-value");
    let roughnessDisplay = document.querySelector("#roughness-value");

    for (material of materials) {
        material.pbrMetallicRoughness.setMetallicFactor(0.9)
        material.pbrMetallicRoughness.setRoughnessFactor(0.7)
        // material.pbrMetallicRoughness.setMetallicFactor(0.400000005960464)
        // material.pbrMetallicRoughness.setRoughnessFactor(0.7071067)
    }
    metalnessDisplay.textContent = 0.9;
    roughnessDisplay.textContent = 0.6;

    document.querySelector('#metalness').addEventListener('input', (event) => {
        for (material of materials) {
            material.pbrMetallicRoughness.setMetallicFactor(event.target.value);
            metalnessDisplay.textContent = Math.round(event.target.value * 100) / 100 ;
        }
    });

    document.querySelector('#roughness').addEventListener('input', (event) => {
        for (material of materials){            
            material.pbrMetallicRoughness.setRoughnessFactor(event.target.value);
            roughnessDisplay.textContent = Math.round(event.target.value * 100) / 100 ;
        }
    });
})
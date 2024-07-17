document.getElementById('generate').addEventListener('click', generateDesign);
document.getElementById('format').addEventListener('change', generateDesign);
document.getElementById('repeats').addEventListener('input', function() {
    document.getElementById('repeatValue').textContent = this.value;
    generateDesign();
});
document.getElementById('sizeVariance').addEventListener('input', function() {
    document.getElementById('sizeVarianceValue').textContent = this.value;
    generateDesign();
});
document.getElementById('download').addEventListener('click', downloadImage);

const shapes = [
    {
        type: 'shape1',
        path: 'M860.54,473.52c0,270.34-208.54,473.52-485.93,473.52H0V0h374.61c277.39,0,485.93,203.18,485.93,473.52Z'
    },
    {
        type: 'shape2',
        path: 'M809.79,689.19c0,152.15-122.25,257.75-283.38,257.75H1.57V.98h493.22c151.06,0,268.86,102.81,268.86,244.03,0,84.95-43.09,161.75-106.33,200.15,89.23,35.61,152.46,134.4,152.46,244.03Z'
    },
    {
        type: 'shape3',
        path: 'M860.54,473.52c0,270.34-208.54,473.52-485.93,473.52H0V0h374.61c277.39,0,485.93,203.18,485.93,473.52Z'
    }
];

const colors = ['#2a86c8', '#ef780a', '#b8ce0e'];

function generateDesign() {
    const format = document.getElementById('format').value;
    const repeats = document.getElementById('repeats').value;
    const sizeVariance = document.getElementById('sizeVariance').value;
    const [width, height] = format.split('x').map(Number);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    // Clear the canvas to make it transparent
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < repeats; i++) {
        drawShapes(ctx, width, height, sizeVariance);
    }

    // Skalierung im Interface
    const aspectRatio = width / height;
    const maxCanvasHeight = window.innerHeight * 0.8;
    const maxCanvasWidth = window.innerWidth * 0.8;
    
    let canvasWidth, canvasHeight;

    if (aspectRatio > 1) {
        canvasWidth = maxCanvasWidth;
        canvasHeight = maxCanvasWidth / aspectRatio;
    } else {
        canvasHeight = maxCanvasHeight;
        canvasWidth = maxCanvasHeight * aspectRatio;
    }

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
}

function drawShapes(ctx, width, height, sizeVariance) {
    // Zufällige Farben für die Shapes auswählen, jede Farbe nur einmal verwenden
    const shapeColors = [...colors];
    shapes.forEach(shape => {
        const colorIndex = Math.floor(Math.random() * shapeColors.length);
        shape.color = shapeColors.splice(colorIndex, 1)[0];
    });

    // Zufällige Größen für die Shapes
    const sizes = [
        height * 0.6 * sizeVariance,
        (Math.random() * (height * 0.3) + (height * 0.2)) * sizeVariance,
        (Math.random() * (height * 0.3) + (height * 0.2)) * sizeVariance
    ];

    // Sortieren der Shapes nach Größe
    const sortedShapes = shapes.map((shape, index) => ({
        ...shape,
        size: sizes[index]
    })).sort((a, b) => a.size - b.size);

    // Positionierung und Rendering der Shapes
    sortedShapes.forEach(shape => {
        let x, y, angle;
        const size = shape.size;

        // Ensure the shape is fully within bounds
        x = Math.random() * (width - size);
        y = Math.random() * (height - size);

        angle = Math.floor(Math.random() * 4) * 90;
        const mirrored = Math.random() < 0.5;

        ctx.save();
        ctx.translate(x + size / 2, y + size / 2);
        ctx.rotate(angle * Math.PI / 180);
        if (mirrored) ctx.scale(-1, 1);
        ctx.fillStyle = shape.color;

        const path = new Path2D(shape.path);
        ctx.scale(size / 860.54, size / 860.54); // Normierung auf die Größe des Pfads
        ctx.fill(path);

        ctx.restore();
    });
}

function downloadImage() {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Initiale Generierung
generateDesign();

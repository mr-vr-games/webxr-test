// This code should be added to the main script, right before the animation loop section

// Animals
function createAnimals(scene) {
    const animalGroup = new THREE.Group();
    scene.add(animalGroup);
    
    // Create deer
    function createDeer() {
        const deer = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.2;
        body.rotation.x = Math.PI / 2;
        body.castShadow = true;
        deer.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0.8, 1.5, 0);
        head.castShadow = true;
        deer.add(head);
        
        // Antlers
        const antlerMaterial = new THREE.MeshStandardMaterial({ color: 0x5C4033 });
        
        // Left antler
        const antlerL1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.5, 4),
            antlerMaterial
        );
        antlerL1.position.set(0.8, 1.8, 0.15);
        antlerL1.rotation.z = -Math.PI / 4;
        deer.add(antlerL1);
        
        const antlerL2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4),
            antlerMaterial
        );
        antlerL2.position.set(1.0, 2.0, 0.15);
        antlerL2.rotation.z = Math.PI / 3;
        deer.add(antlerL2);
        
        // Right antler
        const antlerR1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.5, 4),
            antlerMaterial
        );
        antlerR1.position.set(0.8, 1.8, -0.15);
        antlerR1.rotation.z = -Math.PI / 4;
        deer.add(antlerR1);
        
        const antlerR2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4),
            antlerMaterial
        );
        antlerR2.position.set(1.0, 2.0, -0.15);
        antlerR2.rotation.z = Math.PI / 3;
        deer.add(antlerR2);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.05, 1, 4);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        
        // Front left leg
        const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
        frontLeftLeg.position.set(0.4, 0.5, 0.3);
        frontLeftLeg.castShadow = true;
        deer.add(frontLeftLeg);
        
        // Front right leg
        const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial);
        frontRightLeg.position.set(0.4, 0.5, -0.3);
        frontRightLeg.castShadow = true;
        deer.add(frontRightLeg);
        
        // Back left leg
        const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
        backLeftLeg.position.set(-0.4, 0.5, 0.3);
        backLeftLeg.castShadow = true;
        deer.add(backLeftLeg);
        
        // Back right leg
        const backRightLeg = new THREE.Mesh(legGeometry, legMaterial);
        backRightLeg.position.set(-0.4, 0.5, -0.3);
        backRightLeg.castShadow = true;
        deer.add(backRightLeg);
        
        // Tail
        const tailGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-0.8, 1.2, 0);
        tail.castShadow = true;
        deer.add(tail);
        
        return deer;
    }
    
    // Create rabbit
    function createRabbit() {
        const rabbit = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.25, 8, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.25;
        body.scale.z = 1.5;
        body.castShadow = true;
        rabbit.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0.3, 0.4, 0);
        head.castShadow = true;
        rabbit.add(head);
        
        // Ears
        const earGeometry = new THREE.CapsuleGeometry(0.05, 0.2, 2, 4);
        const earMaterial = new THREE.MeshStandardMaterial({ color: 0xD3D3D3 });
        
        // Left ear
        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(0.3, 0.7, 0.07);
        leftEar.rotation.z = -Math.PI / 8;
        leftEar.castShadow = true;
        rabbit.add(leftEar);
        
        // Right ear
        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(0.3, 0.7, -0.07);
        rightEar.rotation.z = -Math.PI / 8;
        rightEar.castShadow = true;
        rabbit.add(rightEar);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.04, 0.02, 0.2, 4);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
        
        // Front left leg
        const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
        frontLeftLeg.position.set(0.2, 0.1, 0.1);
        frontLeftLeg.castShadow = true;
        rabbit.add(frontLeftLeg);
        
        // Front right leg
        const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial);
        frontRightLeg.position.set(0.2, 0.1, -0.1);
        frontRightLeg.castShadow = true;
        rabbit.add(frontRightLeg);
        
        // Back left leg
        const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
        backLeftLeg.position.set(-0.2, 0.1, 0.1);
        backLeftLeg.scale.y = 1.5;
        backLeftLeg.castShadow = true;
        rabbit.add(backLeftLeg);
        
        // Back right leg
        const backRightLeg = new THREE.Mesh(legGeometry, legMaterial);
        backRightLeg.position.set(-0.2, 0.1, -0.1);
        backRightLeg.scale.y = 1.5;
        backRightLeg.castShadow = true;
        rabbit.add(backRightLeg);
        
        // Tail
        const tailGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-0.35, 0.25, 0);
        tail.castShadow = true;
        rabbit.add(tail);
        
        return rabbit;
    }
    
    // Create bird
    function createBird() {
        const bird = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.15;
        body.scale.z = 1.3;
        body.castShadow = true;
        bird.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0.15, 0.25, 0);
        head.castShadow = true;
        bird.add(head);
        
        // Beak
        const beakGeometry = new THREE.ConeGeometry(0.03, 0.1, 4);
        const beakMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
        const beak = new THREE.Mesh(beakGeometry, beakMaterial);
        beak.position.set(0.25, 0.25, 0);
        beak.rotation.z = -Math.PI / 2;
        beak.castShadow = true;
        bird.add(beak);
        
        // Wings
        const wingGeometry = new THREE.PlaneGeometry(0.3, 0.15);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1E90FF,
            side: THREE.DoubleSide
        });
        
        // Left wing
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(0, 0.25, 0.15);
        leftWing.rotation.y = Math.PI / 2;
        leftWing.rotation.x = -Math.PI / 6;
        leftWing.castShadow = true;
        bird.add(leftWing);
        
        // Right wing
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(0, 0.25, -0.15);
        rightWing.rotation.y = Math.PI / 2;
        rightWing.rotation.x = Math.PI / 6;
        rightWing.castShadow = true;
        bird.add(rightWing);
        
        // Tail
        const tailGeometry = new THREE.PlaneGeometry(0.15, 0.1);
        const tailMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1E90FF,
            side: THREE.DoubleSide
        });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-0.15, 0.15, 0);
        tail.rotation.y = Math.PI / 2;
        tail.castShadow = true;
        bird.add(tail);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 3);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
        
        // Left leg
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(0, 0.05, 0.05);
        leftLeg.castShadow = true;
        bird.add(leftLeg);
        
        // Right leg
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0, 0.05, -0.05);
        rightLeg.castShadow = true;
        bird.add(rightLeg);
        
        return bird;
    }
    
    // Place animals around the scene
    // Add 5 deer at different positions
    for (let i = 0; i < 5; i++) {
        const deer = createDeer();
        const x = Math.random() * 300 - 150;
        const z = Math.random() * 300 - 150;
        deer.position.set(x, 0, z);
        deer.rotation.y = Math.random() * Math.PI * 2;
        deer.scale.set(
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4
        );
        animalGroup.add(deer);
    }

    // Add 10 rabbits at different positions
    for (let i = 0; i < 10; i++) {
        const rabbit = createRabbit();
        const x = Math.random() * 400 - 200;
        const z = Math.random() * 400 - 200;
        rabbit.position.set(x, 0, z);
        rabbit.rotation.y = Math.random() * Math.PI * 2;
        rabbit.scale.set(
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4
        );
        animalGroup.add(rabbit);
    }
    
    // Add 15 birds at different positions
    for (let i = 0; i < 15; i++) {
        const bird = createBird();
        const x = Math.random() * 500 - 250;
        const z = Math.random() * 500 - 250;
        // Some birds on the ground, some in the air
        const y = Math.random() > 0.6 ? 0 : 5 + Math.random() * 15;
        bird.position.set(x, y, z);
        bird.rotation.y = Math.random() * Math.PI * 2;
        bird.scale.set(
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4
        );
        animalGroup.add(bird);
    }
    
    // Add animation for animals
    const animalAnimations = [];
    
    animalGroup.traverse((object) => {
        if (object.isMesh || object.isGroup) {
            if (object !== animalGroup) {
                const initialPosition = object.position.clone();
                const movementRange = 10 + Math.random() * 20;
                const movementSpeed = 0.2 + Math.random() * 0.8;
                
                animalAnimations.push({
                    object: object,
                    initialPosition: initialPosition,
                    movementRange: movementRange,
                    movementSpeed: movementSpeed,
                    time: Math.random() * Math.PI * 2
                });
            }
        }
    });
    
    // Animation update function
    function updateAnimals(deltaTime) {
        animalAnimations.forEach((anim) => {
            anim.time += deltaTime * anim.movementSpeed;
            
            // Just move along X and Z with a sin/cos pattern
            const newX = anim.initialPosition.x + Math.sin(anim.time) * anim.movementRange;
            const newZ = anim.initialPosition.z + Math.cos(anim.time) * anim.movementRange;
            
            // Get direction of movement and rotate animal to face that direction
            const direction = new THREE.Vector2(
                newX - anim.object.position.x,
                newZ - anim.object.position.z
            );
            
            if (direction.length() > 0.01) {
                const angle = Math.atan2(direction.x, direction.y);
                anim.object.rotation.y = angle;
            }
            
            anim.object.position.x = newX;
            anim.object.position.z = newZ;
        });
    }
    
    return { animalGroup, updateAnimals };
}

// Vehicles
function createVehicles(scene) {
    const vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);
    
    // Create a jeep/SUV
    function createJeep() {
        const jeep = new THREE.Group();
        
        // Chassis base
        const chassisGeometry = new THREE.BoxGeometry(3, 0.7, 1.5);
        const chassisMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });
        const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
        chassis.position.y = 0.6;
        chassis.castShadow = true;
        jeep.add(chassis);
        
        // Cabin
        const cabinGeometry = new THREE.BoxGeometry(2, 0.8, 1.4);
        const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x006400 });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 1.35, 0);
        cabin.castShadow = true;
        jeep.add(cabin);
        
        // Windshield
        const windshieldGeometry = new THREE.PlaneGeometry(1, 0.7);
        const windshieldMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xADD8E6,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.set(1, 1.35, 0);
        windshield.rotation.y = Math.PI / 2;
        jeep.add(windshield);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        
        // Front left wheel
        const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFL.position.set(0.9, 0.35, 0.8);
        wheelFL.rotation.z = Math.PI / 2;
        wheelFL.castShadow = true;
        jeep.add(wheelFL);
        
        // Front right wheel
        const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFR.position.set(0.9, 0.35, -0.8);
        wheelFR.rotation.z = Math.PI / 2;
        wheelFR.castShadow = true;
        jeep.add(wheelFR);
        
        // Rear left wheel
        const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRL.position.set(-0.9, 0.35, 0.8);
        wheelRL.rotation.z = Math.PI / 2;
        wheelRL.castShadow = true;
        jeep.add(wheelRL);
        
        // Rear right wheel
        const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRR.position.set(-0.9, 0.35, -0.8);
        wheelRR.rotation.z = Math.PI / 2;
        wheelRR.castShadow = true;
        jeep.add(wheelRR);
        
        // Lights
        const lightGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.4);
        const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, emissive: 0xFFFF00 });
        
        // Front lights
        const lightFL = new THREE.Mesh(lightGeometry, lightMaterial);
        lightFL.position.set(1.55, 0.6, 0.4);
        jeep.add(lightFL);
        
        const lightFR = new THREE.Mesh(lightGeometry, lightMaterial);
        lightFR.position.set(1.55, 0.6, -0.4);
        jeep.add(lightFR);
        
        return jeep;
    }
    
    // Create a sport car
    function createSportsCar() {
        const car = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(4, 0.5, 1.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        body.castShadow = true;
        car.add(body);
        
        // Top/cabin
        const topGeometry = new THREE.BoxGeometry(2, 0.5, 1.6);
        const topMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.set(0, 1, 0);
        top.castShadow = true;
        car.add(top);
        
        // Windshield
        const windshieldGeometry = new THREE.BoxGeometry(0.1, 0.5, 1.5);
        const windshieldMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xADD8E6, 
            transparent: true,
            opacity: 0.5
        });
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.set(1, 1, 0);
        car.add(windshield);
        
        // Rear window
        const rearWindowGeometry = new THREE.BoxGeometry(0.1, 0.5, 1.5);
        const rearWindow = new THREE.Mesh(rearWindowGeometry, windshieldMaterial);
        rearWindow.position.set(-1, 1, 0);
        car.add(rearWindow);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        
        // Front left wheel
        const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFL.position.set(1.2, 0.4, 0.9);
        wheelFL.rotation.z = Math.PI / 2;
        wheelFL.castShadow = true;
        car.add(wheelFL);
        
        // Front right wheel
        const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFR.position.set(1.2, 0.4, -0.9);
        wheelFR.rotation.z = Math.PI / 2;
        wheelFR.castShadow = true;
        car.add(wheelFR);
        
        // Rear left wheel
        const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRL.position.set(-1.2, 0.4, 0.9);
        wheelRL.rotation.z = Math.PI / 2;
        wheelRL.castShadow = true;
        car.add(wheelRL);
        
        // Rear right wheel
        const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRR.position.set(-1.2, 0.4, -0.9);
        wheelRR.rotation.z = Math.PI / 2;
        wheelRR.castShadow = true;
        car.add(wheelRR);
        
        // Spoiler
        const spoilerGeometry = new THREE.BoxGeometry(0.5, 0.1, 1.6);
        const spoilerMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
        spoiler.position.set(-1.8, 0.8, 0);
        car.add(spoiler);
        
        return car;
    }
    
    // Create a motorcycle
    function createMotorcycle() {
        const motorcycle = new THREE.Group();
        
        // Body/frame
        const frameGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8);
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.y = 0.7;
        frame.rotation.z = Math.PI / 2;
        frame.castShadow = true;
        motorcycle.add(frame);
        
        // Seat
        const seatGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.3);
        const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.set(-0.2, 0.9, 0);
        seat.castShadow = true;
        motorcycle.add(seat);
        
        // Gas tank
        const tankGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 8);
        const tankMaterial = new THREE.MeshStandardMaterial({ color: 0x0000CD });
        const tank = new THREE.Mesh(tankGeometry, tankMaterial);
        tank.position.set(0.25, 0.9, 0);
        tank.rotation.z = Math.PI / 2;
        tank.castShadow = true;
        motorcycle.add(tank);
        
        // Handlebar
        const handlebarGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
        const handlebarMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
        const handlebar = new THREE.Mesh(handlebarGeometry, handlebarMaterial);
        handlebar.position.set(0.6, 1.1, 0);
        handlebar.rotation.x = Math.PI / 2;
        handlebar.castShadow = true;
        motorcycle.add(handlebar);
        
        // Front fork
        const forkGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8);
        const forkMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
        const fork = new THREE.Mesh(forkGeometry, forkMaterial);
        fork.position.set(0.6, 0.75, 0);
        fork.castShadow = true;
        motorcycle.add(fork);
        
        // Wheels
        const wheelGeometry = new THREE.TorusGeometry(0.35, 0.06, 16, 24);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        
        // Front wheel
        const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        frontWheel.position.set(0.6, 0.35, 0);
        frontWheel.rotation.y = Math.PI / 2;
        frontWheel.castShadow = true;
        motorcycle.add(frontWheel);
        
        // Rear wheel
        const rearWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        rearWheel.position.set(-0.6, 0.35, 0);
        rearWheel.rotation.y = Math.PI / 2;
        rearWheel.castShadow = true;
        motorcycle.add(rearWheel);
        
        return motorcycle;
    }
    
    // Add vehicles to the scene
    // Sport cars
    for (let i = 0; i < 3; i++) {
        const sportsCar = createSportsCar();
        const x = Math.random() * 500 - 250;
        const z = Math.random() * 500 - 250;
        sportsCar.position.set(x, 0, z);
        sportsCar.rotation.y = Math.random() * Math.PI * 2;
        sportsCar.scale.set(
            0.8 + Math.random() * 0.2,
            0.8 + Math.random() * 0.2,
            0.8 + Math.random() * 0.2
        );
        vehicleGroup.add(sportsCar);
    }
    
    // Jeeps
    for (let i = 0; i < 3; i++) {
        const jeep = createJeep();
        const x = Math.random() * 500 - 250;
        const z = Math.random() * 500 - 250;
        jeep.position.set(x, 0, z);
        jeep.rotation.y = Math.random() * Math.PI * 2;
        vehicleGroup.add(jeep);
    }
    
    // Motorcycles
    for (let i = 0; i < 5; i++) {
        const motorcycle = createMotorcycle();
        const x = Math.random() * 500 - 250;
        const z = Math.random() * 500 - 250;
        motorcycle.position.set(x, 0, z);
        motorcycle.rotation.y = Math.random() * Math.PI * 2;
        motorcycle.scale.set(
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4
        );
        vehicleGroup.add(motorcycle);
    }
    
    // For demos: create a drivable car near the player's starting position
    const playerCar = createSportsCar();
    playerCar.position.set(5, 0, 5);
    vehicleGroup.add(playerCar);
    
    return { vehicleGroup, playerCar };
}

// Add the animals and vehicles to the main script
const { animalGroup, updateAnimals } = createAnimals(scene);
const { vehicleGroup, playerCar } = createVehicles(scene);

// Animation loop update
function animate() {
    const delta = clock.getDelta();
    
    // Update water
    if (water) {
        water.material.uniforms['time'].value += delta;
    }
    
    // Update animal animations
    updateAnimals(delta);
    
    // Handle controller input for movement
    controllers.forEach((controller, index) => {
        handleController(controller, index, delta);
    });
    
    renderer.render(scene, camera);
}

// This code should be added to the main script, right after creating the controller setup

// Add teleportation system for easy movement in VR
function createTeleportationSystem(scene, camera, controller) {
    const raycaster = new THREE.Raycaster();
    const tempMatrix = new THREE.Matrix4();
    
    // Create a teleportation marker
    const markerGeometry = new THREE.RingGeometry(0.25, 0.3, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.rotation.x = -Math.PI / 2;
    marker.visible = false;
    scene.add(marker);
    
    // Set up teleport line
    const MAX_POINTS = 10;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(MAX_POINTS * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.visible = false;
    scene.add(line);
    
    // Teleportation state
    let isTeleporting = false;
    
    // Start teleport
    controller.addEventListener('selectstart', () => {
        isTeleporting = true;
        line.visible = true;
    });
    
    // End teleport
    controller.addEventListener('selectend', () => {
        isTeleporting = false;
        line.visible = false;
        marker.visible = false;
        
        // If we have a valid teleport position, move there
        if (marker.visible && marker.userData.teleportPosition) {
            // Save the camera's Y position and rotation
            const y = camera.position.y;
            const rotation = camera.rotation.y;
            
            // Teleport
            camera.position.copy(marker.userData.teleportPosition);
            
            // Keep the same height and rotation
            camera.position.y = y;
            camera.rotation.y = rotation;
        }
    });
    
    // Update teleport ray
    function updateTeleportRay() {
        if (!isTeleporting) return;
        
        // Get the controller's position and orientation
        tempMatrix.identity().extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
        
        // Check for intersections with the ground
        const intersects = raycaster.intersectObjects([ground]);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            marker.position.copy(point);
            marker.position.y += 0.01; // Slightly above ground to avoid z-fighting
            marker.visible = true;
            marker.userData.teleportPosition = point.clone();
            
            // Update the teleport line
            const positions = line.geometry.attributes.position.array;
            const origin = raycaster.ray.origin;
            
            // Create a curved line to the teleport point
            for (let i = 0; i < MAX_POINTS; i++) {
                const t = i / (MAX_POINTS - 1);
                const x = origin.x + (point.x - origin.x) * t;
                
                // Add a slight arc
                const y = origin.y + (point.y - origin.y) * t - Math.sin(t * Math.PI) * 2;
                const z = origin.z + (point.z - origin.z) * t;
                
                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;
            }
            
            line.geometry.attributes.position.needsUpdate = true;
        } else {
            marker.visible = false;
        }
    }
    
    return { updateTeleportRay };
}

// Create teleportation system for both controllers
const { updateTeleportRay: updateTeleportRay0 } = createTeleportationSystem(scene, camera, controller0);
const { updateTeleportRay: updateTeleportRay1 } = createTeleportationSystem(scene, camera, controller1);

// Sound effects
function setupSoundEffects() {
    // Create an audio listener
    const listener = new THREE.AudioListener();
    camera.add(listener);
    
    // Ambient sounds: birds, wind, etc.
    const ambientSound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    
    // Load nature ambient sound (placeholder - would need a real file in production)
    // audioLoader.load('sounds/nature_ambient.mp3', function(buffer) {
    //     ambientSound.setBuffer(buffer);
    //     ambientSound.setLoop(true);
    //     ambientSound.setVolume(0.5);
    //     ambientSound.play();
    // });
    
    // For each animal type, you could add specific sounds
    // For example, deer sounds
    // const deerSound = new THREE.PositionalAudio(listener);
    // audioLoader.load('sounds/deer.mp3', function(buffer) {
    //     deerSound.setBuffer(buffer);
    //     deerSound.setRefDistance(20);
    //     // Add to a deer object
    //     animalGroup.children[0].add(deerSound);
    // });
    
    // Similarly for vehicles
    // const carSound = new THREE.PositionalAudio(listener);
    // audioLoader.load('sounds/car_engine.mp3', function(buffer) {
    //     carSound.setBuffer(buffer);
    //     carSound.setLoop(true);
    //     carSound.setRefDistance(20);
    //     carSound.setVolume(0.5);
    //     playerCar.add(carSound);
    // });
}

// Initialize sound effects
// setupSoundEffects(); // Uncomment when you have sound files

// Additional environment details
function addAdditionalDetails(scene) {
    // Create clouds
    const cloudGroup = new THREE.Group();
    scene.add(cloudGroup);
    
    function createCloud() {
        const cloud = new THREE.Group();
        
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        
        // Create a group of spheres to form a cloud
        const numPuffs = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < numPuffs; i++) {
            const puffSize = 1.5 + Math.random() * 4;
            const puffGeometry = new THREE.SphereGeometry(puffSize, 8, 8);
            const puff = new THREE.Mesh(puffGeometry, cloudMaterial);
            
            const x = Math.random() * 10 - 5;
            const y = Math.random() * 3 - 1.5;
            const z = Math.random() * 10 - 5;
            
            puff.position.set(x, y, z);
            cloud.add(puff);
        }
        
        return cloud;
    }
    
    // Add clouds to the scene
    for (let i = 0; i < 20; i++) {
        const cloud = createCloud();
        
        const x = Math.random() * 1000 - 500;
        const y = 80 + Math.random() * 50;
        const z = Math.random() * 1000 - 500;
        
        cloud.position.set(x, y, z);
        cloud.scale.set(
            2 + Math.random() * 3,
            1 + Math.random() * 1.5,
            2 + Math.random() * 3
        );
        
        cloudGroup.add(cloud);
    }
    
    // Create rocks
    const rockGroup = new THREE.Group();
    scene.add(rockGroup);
    
    function createRock() {
        const rockGeometry = new THREE.DodecahedronGeometry(1, 1);
        
        // Distort the geometry for more natural look
        const positions = rockGeometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            
            const distortion = 0.2;
            positions.setXYZ(
                i,
                x * (1 + Math.random() * distortion),
                y * (1 + Math.random() * distortion),
                z * (1 + Math.random() * distortion)
            );
        }
        
        rockGeometry.computeVertexNormals();
        
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x7b7b7b,
            roughness: 1.0,
            metalness: 0.2
        });
        
        return new THREE.Mesh(rockGeometry, rockMaterial);
    }
    
    // Add rocks to the scene
    for (let i = 0; i < 100; i++) {
        const rock = createRock();
        
        const x = Math.random() * 500 - 250;
        const z = Math.random() * 500 - 250;
        
        rock.position.set(x, 0, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        const scale = 0.5 + Math.random() * 2;
        rock.scale.set(scale, scale * 0.8, scale);
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        rockGroup.add(rock);
    }
    
    // Create flowers
    const flowerGroup = new THREE.Group();
    scene.add(flowerGroup);
    
    function createFlower() {
        const flower = new THREE.Group();
        
        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x00aa00 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.25;
        flower.add(stem);
        
        // Random flower color
        const colors = [
            0xFF1493, // pink
            0xFFFF00, // yellow
            0xFF4500, // orange
            0xFF0000, // red
            0x800080, // purple
            0x0000FF  // blue
        ];
        const flowerColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Petals
        const petalGeometry = new THREE.CircleGeometry(0.1, 8);
        const petalMaterial = new THREE.MeshStandardMaterial({ 
            color: flowerColor,
            side: THREE.DoubleSide
        });
        
        const petalCount = 5 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < petalCount; i++) {
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            const angle = (i / petalCount) * Math.PI * 2;
            petal.position.set(
                Math.sin(angle) * 0.08,
                0.5,
                Math.cos(angle) * 0.08
            );
            petal.rotation.x = Math.PI / 2;
            petal.rotation.y = angle;
            flower.add(petal);
        }
        
        // Center of flower
        const centerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const centerMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.position.y = 0.5;
        flower.add(center);
        
        return flower;
    }
    
    // Add flowers to the scene
    for (let i = 0; i < 500; i++) {
        const flower = createFlower();
        
        const x = Math.random() * 500 - 250;
        const z = Math.random() * 500 - 250;
        
        flower.position.set(x, 0, z);
        flower.rotation.y = Math.random() * Math.PI * 2;
        
        flowerGroup.add(flower);
    }
    
    // Create a small river
    function createRiver() {
        // River geometry - a curved path
        const riverPoints = [];
        const riverSegments = 20;
        const riverWidth = 10;
        const riverLength = 300;
        
        for (let i = 0; i <= riverSegments; i++) {
            const t = i / riverSegments;
            const x = t * riverLength - riverLength / 2;
            const z = Math.sin(t * Math.PI * 2) * 50;
            riverPoints.push(new THREE.Vector3(x, -0.2, z));
        }
        
        const riverCurve = new THREE.CatmullRomCurve3(riverPoints);
        const riverGeometry = new THREE.TubeGeometry(riverCurve, 20, riverWidth, 8, false);
        
        const riverMaterial = new THREE.MeshStandardMaterial({
            color: 0x0077be,
            metalness: 0.1,
            roughness: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const river = new THREE.Mesh(riverGeometry, riverMaterial);
        scene.add(river);
        
        // Add rocks along the river banks
        for (let i = 0; i < 50; i++) {
            const t = Math.random();
            const point = riverCurve.getPoint(t);
            const tangent = riverCurve.getTangent(t);
            
            const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
            
            const distance = riverWidth + 1 + Math.random() * 3;
            const side = Math.random() > 0.5 ? 1 : -1;
            
            const rock = createRock();
            rock.position.set(
                point.x + normal.x * distance * side,
                0,
                point.z + normal.z * distance * side
            );
            
            const scale = 0.2 + Math.random() * 0.8;
            rock.scale.set(scale, scale, scale);
            
            scene.add(rock);
        }
        
        // Add water lilies to the river
        for (let i = 0; i < 20; i++) {
            const t = Math.random();
            const point = riverCurve.getPoint(t);
            
            const lilyPad = new THREE.Group();
            
            // Lily pad leaf
            const leafGeometry = new THREE.CircleGeometry(1 + Math.random() * 0.5, 8);
            const leafMaterial = new THREE.MeshStandardMaterial({
                color: 0x006400,
                side: THREE.DoubleSide
            });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.rotation.x = -Math.PI / 2;
            leaf.position.y = -0.19;
            lilyPad.add(leaf);
            
            // Lily flower (for some pads)
            if (Math.random() > 0.5) {
                const flowerGeometry = new THREE.SphereGeometry(0.3, 8, 4);
                const flowerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF
                });
                const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
                flower.position.y = -0.1;
                flower.scale.y = 0.5;
                lilyPad.add(flower);
                
                const centerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const centerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFF00
                });
                const center = new THREE.Mesh(centerGeometry, centerMaterial);
                center.position.y = -0.1;
                lilyPad.add(center);
            }
            
            lilyPad.position.set(
                point.x + (Math.random() * 2 - 1) * (riverWidth * 0.7),
                0,
                point.z + (Math.random() * 2 - 1) * (riverWidth * 0.7)
            );
            lilyPad.rotation.y = Math.random() * Math.PI * 2;
            
            scene.add(lilyPad);
        }
        
        return river;
    }
    
    const river = createRiver();
    
    // Create a simple bridge over the river
    function createBridge() {
        const bridge = new THREE.Group();
        
        // Bridge base
        const baseGeometry = new THREE.BoxGeometry(5, 0.5, 14);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.9
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        bridge.add(base);
        
        // Railings
        const railHeight = 1;
        
        // Left railing
        const leftRailingGeometry = new THREE.BoxGeometry(5, railHeight, 0.3);
        const leftRailing = new THREE.Mesh(leftRailingGeometry, baseMaterial);
        leftRailing.position.set(0, railHeight / 2, 6.8);
        bridge.add(leftRailing);
        
        // Right railing
        const rightRailingGeometry = new THREE.BoxGeometry(5, railHeight, 0.3);
        const rightRailing = new THREE.Mesh(rightRailingGeometry, baseMaterial);
        rightRailing.position.set(0, railHeight / 2, -6.8);
        bridge.add(rightRailing);
        
        // Railing posts
        for (let i = -2; i <= 2; i++) {
            const xPos = i * 2;
            
            // Left post
            const leftPostGeometry = new THREE.BoxGeometry(0.3, railHeight * 1.2, 0.3);
            const leftPost = new THREE.Mesh(leftPostGeometry, baseMaterial);
            leftPost.position.set(xPos, railHeight * 0.6, 6.8);
            bridge.add(leftPost);
            
            // Right post
            const rightPostGeometry = new THREE.BoxGeometry(0.3, railHeight * 1.2, 0.3);
            const rightPost = new THREE.Mesh(rightPostGeometry, baseMaterial);
            rightPost.position.set(xPos, railHeight * 0.6, -6.8);
            bridge.add(rightPost);
        }
        
        bridge.position.set(0, 0, 0);
        bridge.rotation.y = Math.PI / 2;
        
        return bridge;
    }
    
    const bridge = createBridge();
    bridge.position.set(0, 0, 0);
    scene.add(bridge);
    
    return { cloudGroup, rockGroup, flowerGroup, river, bridge };
}

// Add environment details
const environmentDetails = addAdditionalDetails(scene);

// Update the animation loop to include the new teleportation raycasting
function animate() {
    const delta = clock.getDelta();
    
    // Update water
    if (water) {
        water.material.uniforms['time'].value += delta;
    }
    
    // Update animal animations
    updateAnimals(delta);
    
    // Update teleportation rays
    updateTeleportRay0();
    updateTeleportRay1();
    
    // Handle controller input for movement
    controllers.forEach((controller, index) => {
        handleController(controller, index, delta);
    });
    
    // Animation for clouds - slow movement
    if (environmentDetails && environmentDetails.cloudGroup) {
        environmentDetails.cloudGroup.children.forEach((cloud, index) => {
            const speed = 0.5 + Math.sin(index) * 0.3;
            cloud.position.x += delta * speed;
            
            // Loop clouds when they go too far
            if (cloud.position.x > 600) {
                cloud.position.x = -600;
            }
        });
    }
    
    renderer.render(scene, camera);
}

// Performance optimizations
function optimizePerformance() {
    // Use frustum culling
    const frustum = new THREE.Frustum();
    const projScreenMatrix = new THREE.Matrix4();
    
    // WebXR-aware frustum culling helper
    function updateFrustumCulling() {
        if (!renderer.xr.isPresenting) {
            // Standard culling in non-VR mode
            projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            frustum.setFromProjectionMatrix(projScreenMatrix);
            
            // Apply culling to object groups
            applyFrustumCulling(animalGroup);
            applyFrustumCulling(vehicleGroup);
            // Add other groups as needed
        }
    }
    
    function applyFrustumCulling(group) {
        if (!group) return;
        
        group.children.forEach(object => {
            if (object.position.distanceTo(camera.position) > 100) {
                // Only cull distant objects (>100 units away)
                object.visible = frustum.intersectsObject(object);
            } else {
                // Always show close objects
                object.visible = true;
            }
        });
    }
    
    // Level of detail system for complex objects
    function setupLODSystem() {
        // Example for trees (would need to be expanded)
        treePositions.forEach((pos, index) => {
            if (index % 5 === 0) { // Only apply to every 5th tree for this example
                const tree = scene.getObjectByName(`tree_${index}`);
                if (tree) {
                    const lod = new THREE.LOD();
                    
                    // High detail model (original)
                    lod.addLevel(tree, 0);
                    
                    // Medium detail model (simplified)
                    const mediumTree = createSimpleTree();
                    mediumTree.scale.set(0.9, 0.9, 0.9);
                    lod.addLevel(mediumTree, 50);
                    
                    // Low detail model (very simplified)
                    const lowTree = new THREE.Mesh(
                        new THREE.BoxGeometry(3, 5, 3),
                        new THREE.MeshBasicMaterial({ color: 0x228B22 })
                    );
                    lod.addLevel(lowTree, 150);
                    
                    lod.position.copy(tree.position);
                    scene.add(lod);
                    scene.remove(tree);
                }
            }
        });
    }
    
    // Call optimization functions
    // setupLODSystem(); // Would need more complete implementation
    
    // Add frustum culling to render loop
    const originalAnimate = animate;
    animate = function() {
        updateFrustumCulling();
        originalAnimate();
    };
}

// Call performance optimizations
// optimizePerformance(); // Uncomment if needed for performance

// Add instructions for users
const instructions = document.createElement('div');
instructions.style.position = 'absolute';
instructions.style.top = '20px';
instructions.style.width = '100%';
instructions.style.textAlign = 'center';
instructions.style.fontFamily = 'Arial, sans-serif';
instructions.style.fontSize = '20px';
instructions.style.color = 'white';
instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
instructions.style.padding = '10px';
instructions.style.zIndex = '100';
instructions.innerHTML = `
    <h2>WebXR Grassland Experience</h2>
    <p>Use controller joysticks to move around.</p>
    <p>Point at the ground and press trigger to teleport.</p>
    <p>Explore the landscape, animals, and vehicles!</p>
`;
document.body.appendChild(instructions);

// Hide instructions when entering VR
renderer.xr.addEventListener('sessionstart', () => {
    instructions.style.display = 'none';
});

// Show instructions when exiting VR
renderer.xr.addEventListener('sessionend', () => {
    instructions.style.display = 'block';
});

// Hide loading when everything is ready
document.getElementById('loading').style.display = 'none';
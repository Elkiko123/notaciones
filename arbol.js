/**
 * Clase principal para visualizar árboles de expresiones
 * Maneja la construcción del árbol, los recorridos y las animaciones
 */
class ExpressionTreeVisualizer {
    constructor() {
        // Propiedades principales de la clase
        this.tree = null;                    // Árbol de la expresión
        this.currentTraversal = null;       // Recorrido actual (preorden, infijo, postorden)
        this.currentStep = 0;               // Paso actual en la animación
        this.isAnimating = false;           // Flag para controlar si está animando
        
        // Inicializar componentes
        this.initializeElements();          // Obtener referencias a elementos DOM
        this.bindEvents();                  // Configurar event listeners
        this.buildTree();                   // Construir el árbol de la expresión
    }

    /**
     * Inicializa las referencias a los elementos del DOM
     * Obtiene los contenedores y botones necesarios para la interfaz
     */
    initializeElements() {
        // Contenedores principales
        this.treeContainer = document.getElementById('tree');        // Contenedor del árbol visual
        this.resultDisplay = document.getElementById('resultDisplay'); // Panel de resultados
        this.stepsContainer = document.getElementById('steps');     // Contenedor de pasos
        
        // Botones de control
        this.preorderBtn = document.getElementById('preorderBtn');   // Botón para recorrido preorden
        this.inorderBtn = document.getElementById('inorderBtn');     // Botón para recorrido infijo
        this.postorderBtn = document.getElementById('postorderBtn'); // Botón para recorrido postorden
        this.resetBtn = document.getElementById('resetBtn');         // Botón para reiniciar
    }

    /**
     * Configura los event listeners para los botones
     * Asocia cada botón con su función correspondiente
     */
    bindEvents() {
        // Event listeners para los botones de recorrido
        this.preorderBtn.addEventListener('click', () => this.startTraversal('preorder'));
        this.inorderBtn.addEventListener('click', () => this.startTraversal('inorder'));
        this.postorderBtn.addEventListener('click', () => this.startTraversal('postorder'));
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    /**
     * Construye el árbol de la expresión (5*10)/((3-8)+5)
     * Crea todos los nodos y establece las relaciones padre-hijo
     */
    buildTree() {
        // Crear todos los nodos del árbol
        const root = this.createNode('/', 'root');           // Nodo raíz: división principal
        const multiply = this.createNode('*', 'multiply');  // Multiplicación: 5 * 10
        const divide = this.createNode('/', 'divide');       // División: (3-8) / 5
        const five1 = this.createNode('5', 'five1');        // Primer número 5
        const ten = this.createNode('10', 'ten');           // Número 10
        const add = this.createNode('+', 'add');            // Suma: (3-8) + 5
        const subtract = this.createNode('-', 'subtract');  // Resta: 3 - 8
        const three = this.createNode('3', 'three');        // Número 3
        const eight = this.createNode('8', 'eight');        // Número 8
        const five2 = this.createNode('5', 'five2');        // Segundo número 5

        // Establecer la estructura jerárquica del árbol
        // Nivel 1: Raíz
        root.left = multiply;    // Hijo izquierdo: multiplicación
        root.right = divide;     // Hijo derecho: división
        
        // Nivel 2: Hijos de la multiplicación
        multiply.left = five1;   // Hijo izquierdo: 5
        multiply.right = ten;    // Hijo derecho: 10
        
        // Nivel 2: Hijos de la división
        divide.left = subtract;  // Hijo izquierdo: resta
        divide.right = five2;   // Hijo derecho: 5
        
        // Nivel 3: Hijos de la resta
        subtract.left = three;  // Hijo izquierdo: 3
        subtract.right = eight; // Hijo derecho: 8

        // Asignar el árbol construido y renderizarlo
        this.tree = root;
        this.renderTree();
    }

    /**
     * Crea un nuevo nodo del árbol
     * @param {string} value - El valor del nodo (operador o número)
     * @param {string} id - Identificador único del nodo
     * @returns {Object} Objeto nodo con sus propiedades
     */
    createNode(value, id) {
        return {
            value: value,        // Valor del nodo (ej: '+', '5', '/')
            id: id,             // ID único para identificar el nodo
            left: null,         // Referencia al hijo izquierdo
            right: null,        // Referencia al hijo derecho
            element: null       // Referencia al elemento DOM (se asignará después)
        };
    }

    /**
     * Renderiza el árbol completo en el DOM
     * Limpia el contenedor y crea todos los elementos visuales
     */
    renderTree() {
        // Limpiar el contenedor del árbol
        this.treeContainer.innerHTML = '';
        
        // Crear el elemento visual del nodo raíz recursivamente
        const rootElement = this.createNodeElement(this.tree);
        this.treeContainer.appendChild(rootElement);
        
        // Crear líneas de conexión después de un breve delay
        // Esto asegura que el DOM esté completamente renderizado
        setTimeout(() => {
            this.createConnections();
        }, 200);
    }

    /**
     * Crea el elemento visual de un nodo recursivamente
     * @param {Object} node - El nodo a renderizar
     * @returns {HTMLElement} Elemento DOM del nodo
     */
    createNodeElement(node) {
        // Crear el contenedor principal del nodo
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'node';
        nodeDiv.id = `node-${node.id}`;
        nodeDiv.style.position = 'relative';
        
        // Crear el círculo que muestra el valor del nodo
        const circle = document.createElement('div');
        circle.className = 'node-circle';
        circle.textContent = node.value;  // Mostrar el valor (operador o número)
        circle.id = `circle-${node.id}`;
        
        // Agregar el círculo al contenedor del nodo
        nodeDiv.appendChild(circle);
        node.element = circle;  // Guardar referencia para animaciones
        
        // Si el nodo tiene hijos, crear contenedores para ellos
        if (node.left || node.right) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children-container';
            
            // Estilos para organizar los hijos horizontalmente
            childrenContainer.style.display = 'flex';
            childrenContainer.style.gap = '60px';           // Espacio entre hijos
            childrenContainer.style.marginTop = '40px';     // Espacio desde el padre
            childrenContainer.style.justifyContent = 'center';
            childrenContainer.style.alignItems = 'flex-start';
            
            // Crear recursivamente el hijo izquierdo si existe
            if (node.left) {
                const leftChild = this.createNodeElement(node.left);
                childrenContainer.appendChild(leftChild);
            }
            
            // Crear recursivamente el hijo derecho si existe
            if (node.right) {
                const rightChild = this.createNodeElement(node.right);
                childrenContainer.appendChild(rightChild);
            }
            
            // Agregar el contenedor de hijos al nodo
            nodeDiv.appendChild(childrenContainer);
        }
        
        return nodeDiv;
    }

    /**
     * Crea las líneas de conexión entre nodos padre e hijos
     * Limpia líneas existentes y dibuja nuevas conexiones
     */
    createConnections() {
        // Limpiar líneas existentes para evitar duplicados
        const existingLines = this.treeContainer.querySelectorAll('.connection-line');
        existingLines.forEach(line => line.remove());
        
        // Crear conexiones recursivamente para todos los nodos
        this.createConnectionLines(this.tree);
    }

    /**
     * Crea líneas de conexión recursivamente para un nodo y sus hijos
     * @param {Object} node - El nodo actual
     */
    createConnectionLines(node) {
        if (!node) return;  // Caso base: nodo nulo
        
        // Conectar con el hijo izquierdo si existe
        if (node.left) {
            this.drawConnection(node.id, node.left.id);
            this.createConnectionLines(node.left);  // Recursión para el hijo izquierdo
        }
        
        // Conectar con el hijo derecho si existe
        if (node.right) {
            this.drawConnection(node.id, node.right.id);
            this.createConnectionLines(node.right); // Recursión para el hijo derecho
        }
    }

    /**
     * Dibuja una línea de conexión entre dos nodos
     * @param {string} parentId - ID del nodo padre
     * @param {string} childId - ID del nodo hijo
     */
    drawConnection(parentId, childId) {
        // Obtener elementos DOM de los nodos
        const parentElement = document.getElementById(`node-${parentId}`);
        const childElement = document.getElementById(`node-${childId}`);
        
        if (!parentElement || !childElement) return;
        
        // Obtener posiciones de los círculos (no de los contenedores)
        const parentCircle = parentElement.querySelector('.node-circle');
        const childCircle = childElement.querySelector('.node-circle');
        
        if (!parentCircle || !childCircle) return;
        
        // Calcular posiciones relativas al contenedor del árbol
        const parentRect = parentCircle.getBoundingClientRect();
        const childRect = childCircle.getBoundingClientRect();
        const containerRect = this.treeContainer.getBoundingClientRect();
        
        // Calcular coordenadas relativas al contenedor
        const parentX = parentRect.left - containerRect.left + parentRect.width / 2;  // Centro X del padre
        const parentY = parentRect.bottom - containerRect.top;                        // Borde inferior del padre
        const childX = childRect.left - containerRect.left + childRect.width / 2;    // Centro X del hijo
        const childY = childRect.top - containerRect.top;                           // Borde superior del hijo
        
        // Crear línea vertical desde el padre hacia abajo
        const verticalLine = document.createElement('div');
        verticalLine.className = 'connection-line vertical';
        verticalLine.style.position = 'absolute';
        verticalLine.style.left = `${parentX - 1}px`;                    // Centrar la línea
        verticalLine.style.top = `${parentY}px`;                          // Desde el padre
        verticalLine.style.width = '2px';                                // Grosor de la línea
        verticalLine.style.height = `${Math.abs(childY - parentY)}px`;    // Altura hasta el hijo
        verticalLine.style.backgroundColor = '#4a5568';
        verticalLine.style.zIndex = '1';                                  // Detrás de los nodos
        
        // Crear línea horizontal hacia el hijo
        const horizontalLine = document.createElement('div');
        horizontalLine.className = 'connection-line horizontal';
        horizontalLine.style.position = 'absolute';
        horizontalLine.style.left = `${Math.min(parentX, childX)}px`;     // Desde el más a la izquierda
        horizontalLine.style.top = `${childY - 1}px`;                     // Hasta el hijo
        horizontalLine.style.width = `${Math.abs(childX - parentX)}px`;   // Ancho entre nodos
        horizontalLine.style.height = '2px';                             // Grosor de la línea
        horizontalLine.style.backgroundColor = '#4a5568';
        horizontalLine.style.zIndex = '1';                                // Detrás de los nodos
        
        // Agregar las líneas al contenedor del árbol
        this.treeContainer.appendChild(verticalLine);
        this.treeContainer.appendChild(horizontalLine);
    }

    /**
     * Inicia un recorrido del árbol según el tipo especificado
     * @param {string} type - Tipo de recorrido: 'preorder', 'inorder', 'postorder'
     */
    startTraversal(type) {
        if (this.isAnimating) return;  // Evitar múltiples animaciones simultáneas
        
        this.reset();                  // Limpiar estado anterior
        this.isAnimating = true;       // Marcar como animando
        
        let traversal;                 // Array con el orden de visita de nodos
        let result;                    // String con la notación resultante
        
        // Seleccionar el tipo de recorrido y obtener resultado
        switch (type) {
            case 'preorder':
                traversal = this.preorderTraversal(this.tree);    // Recorrido preorden
                result = this.preorderResult(this.tree);          // Notación prefija
                break;
            case 'inorder':
                traversal = this.inorderTraversal(this.tree);     // Recorrido infijo
                result = this.inorderResult(this.tree);          // Notación infija
                break;
            case 'postorder':
                traversal = this.postorderTraversal(this.tree);   // Recorrido postorden
                result = this.postorderResult(this.tree);        // Notación postfija
                break;
        }
        
        // Configurar el recorrido actual y mostrar resultado
        this.currentTraversal = traversal;
        this.resultDisplay.innerHTML = `<span class="result-text">${result}</span>`;
        
        // Iniciar la animación paso a paso
        this.animateTraversal();
    }

    /**
     * Recorrido preorden: Raíz → Izquierda → Derecha
     * @param {Object} node - Nodo actual
     * @returns {Array} Array de nodos en orden preorden
     */
    preorderTraversal(node) {
        if (!node) return [];  // Caso base: nodo nulo
        
        const result = [];
        result.push(node);     // 1. Visitar la raíz primero
        
        // 2. Recorrer subárbol izquierdo recursivamente
        if (node.left) {
            result.push(...this.preorderTraversal(node.left));
        }
        
        // 3. Recorrer subárbol derecho recursivamente
        if (node.right) {
            result.push(...this.preorderTraversal(node.right));
        }
        
        return result;
    }

    /**
     * Recorrido infijo: Izquierda → Raíz → Derecha
     * @param {Object} node - Nodo actual
     * @returns {Array} Array de nodos en orden infijo
     */
    inorderTraversal(node) {
        if (!node) return [];  // Caso base: nodo nulo
        
        const result = [];
        
        // 1. Recorrer subárbol izquierdo recursivamente
        if (node.left) {
            result.push(...this.inorderTraversal(node.left));
        }
        
        result.push(node);     // 2. Visitar la raíz en el medio
        
        // 3. Recorrer subárbol derecho recursivamente
        if (node.right) {
            result.push(...this.inorderTraversal(node.right));
        }
        
        return result;
    }

    /**
     * Recorrido postorden: Izquierda → Derecha → Raíz
     * @param {Object} node - Nodo actual
     * @returns {Array} Array de nodos en orden postorden
     */
    postorderTraversal(node) {
        if (!node) return [];  // Caso base: nodo nulo
        
        const result = [];
        
        // 1. Recorrer subárbol izquierdo recursivamente
        if (node.left) {
            result.push(...this.postorderTraversal(node.left));
        }
        
        // 2. Recorrer subárbol derecho recursivamente
        if (node.right) {
            result.push(...this.postorderTraversal(node.right));
        }
        
        result.push(node);     // 3. Visitar la raíz al final
        
        return result;
    }

    /**
     * Genera la notación prefija (preorden) como string
     * @param {Object} node - Nodo actual
     * @returns {string} Notación prefija
     */
    preorderResult(node) {
        if (!node) return '';  // Caso base: nodo nulo
        
        let result = node.value;  // 1. Agregar valor de la raíz primero
        
        // 2. Agregar resultado del subárbol izquierdo
        if (node.left) {
            result += ' ' + this.preorderResult(node.left);
        }
        
        // 3. Agregar resultado del subárbol derecho
        if (node.right) {
            result += ' ' + this.preorderResult(node.right);
        }
        
        return result;
    }

    /**
     * Genera la notación infija (infijo) como string
     * @param {Object} node - Nodo actual
     * @returns {string} Notación infija
     */
    inorderResult(node) {
        if (!node) return '';  // Caso base: nodo nulo
        
        let result = '';
        
        // 1. Agregar resultado del subárbol izquierdo
        if (node.left) {
            result += this.inorderResult(node.left) + ' ';
        }
        
        result += node.value;  // 2. Agregar valor de la raíz en el medio
        
        // 3. Agregar resultado del subárbol derecho
        if (node.right) {
            result += ' ' + this.inorderResult(node.right);
        }
        
        return result;
    }

    /**
     * Genera la notación postfija (postorden) como string
     * @param {Object} node - Nodo actual
     * @returns {string} Notación postfija
     */
    postorderResult(node) {
        if (!node) return '';  // Caso base: nodo nulo
        
        let result = '';
        
        // 1. Agregar resultado del subárbol izquierdo
        if (node.left) {
            result += this.postorderResult(node.left) + ' ';
        }
        
        // 2. Agregar resultado del subárbol derecho
        if (node.right) {
            result += this.postorderResult(node.right) + ' ';
        }
        
        result += node.value;  // 3. Agregar valor de la raíz al final
        
        return result;
    }

    /**
     * Anima el recorrido paso a paso, resaltando cada nodo
     * Se ejecuta recursivamente hasta completar todo el recorrido
     */
    animateTraversal() {
        // Verificar si hemos completado el recorrido
        if (this.currentStep >= this.currentTraversal.length) {
            this.isAnimating = false;  // Marcar animación como terminada
            return;
        }
        
        // Obtener el nodo actual del recorrido
        const currentNode = this.currentTraversal[this.currentStep];
        const circle = document.getElementById(`circle-${currentNode.id}`);
        
        if (circle) {
            // Resaltar el nodo actual con clase CSS
            circle.classList.add('current');
            
            // Agregar el paso a la lista visual
            this.addStep(currentNode.value, this.currentStep);
            
            // Después de 1 segundo, marcar como visitado y continuar
            setTimeout(() => {
                circle.classList.remove('current');    // Quitar resaltado actual
                circle.classList.add('visited');       // Marcar como visitado
                this.updateStep(this.currentStep);     // Actualizar paso en la lista
                
                this.currentStep++;                    // Avanzar al siguiente paso
                this.animateTraversal();               // Continuar recursivamente
            }, 1000);
        }
    }

    /**
     * Agrega un paso a la lista visual de pasos
     * @param {string} value - Valor del nodo
     * @param {number} index - Índice del paso
     */
    addStep(value, index) {
        const stepElement = document.createElement('span');
        stepElement.className = 'step';
        stepElement.textContent = value;
        stepElement.id = `step-${index}`;
        
        this.stepsContainer.appendChild(stepElement);
    }

    /**
     * Actualiza el estado visual de un paso (de actual a completado)
     * @param {number} index - Índice del paso a actualizar
     */
    updateStep(index) {
        const stepElement = document.getElementById(`step-${index}`);
        if (stepElement) {
            stepElement.classList.remove('current');    // Quitar estado actual
            stepElement.classList.add('completed');      // Marcar como completado
        }
    }

    /**
     * Reinicia el estado de la visualización
     * Limpia todas las clases CSS y resetea las variables
     */
    reset() {
        // Resetear variables de estado
        this.isAnimating = false;
        this.currentStep = 0;
        this.currentTraversal = null;
        
        // Limpiar clases CSS de los nodos
        const circles = document.querySelectorAll('.node-circle');
        circles.forEach(circle => {
            circle.classList.remove('current', 'visited', 'highlighted');
        });
        
        // Limpiar clases CSS de las líneas de conexión
        const lines = document.querySelectorAll('.connection-line');
        lines.forEach(line => {
            line.classList.remove('highlighted');
        });
        
        // Limpiar la lista de pasos
        this.stepsContainer.innerHTML = '';
        
        // Restaurar mensaje inicial
        this.resultDisplay.innerHTML = '<span class="result-text">Selecciona un tipo de recorrido para ver el resultado</span>';
    }
}

/**
 * Inicialización de la aplicación
 * Espera a que el DOM esté completamente cargado antes de crear el visualizador
 */
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del visualizador de árboles
    const visualizer = new ExpressionTreeVisualizer();
    
    // Mostrar mensaje de bienvenida en la consola
    setTimeout(() => {
        console.log('🌳 Visualizador de Árbol de Expresiones iniciado');
        console.log('📝 Expresión: (5*10)/((3-8)+5)');
        console.log('🎯 Usa los botones para ver los diferentes tipos de recorrido');
        console.log('📚 Tipos de recorrido disponibles:');
        console.log('   • Prefija (Preorden): Raíz → Izquierda → Derecha');
        console.log('   • Infija (Entreorden): Izquierda → Raíz → Derecha');
        console.log('   • Postfija (Postorden): Izquierda → Derecha → Raíz');
    }, 1000);
});

window.addEventListener('DOMContentLoaded', (e) => {
    state = {
    
        weight: {
            min: 30,
            max: 140,
            current:  getWeight()
        },
        height: {
            min: 120,
            max: 240,
            current: getHeight()
        },
        output: getOutputState() || false,
        result: getResultState() || null    
    
    }

    const weightMin = document.querySelector('#weight-min')
    const weightMax = document.querySelector('#weight-max')
    const wSlider = document.querySelector('#weightslider')
    const weightCurr = document.querySelector('#weight')

    const heightMin = document.querySelector('#height-min')
    const heightMax = document.querySelector('#height-max')
    const hSlider = document.querySelector('#heightslider')
    const heightCurr = document.querySelector('#height')

    const calcBtn = document.querySelector('#calculate');

    const out = document.querySelector('output');

    //Setting current state.
    weightMin.innerHTML = state.weight.min;
    weightMax.innerHTML = state.weight.max;
    weightCurr.innerHTML = state.weight.current;
    wSlider.min = state.weight.min;
    wSlider.max = state.weight.max;
    wSlider.value = state.weight.current;

    heightMin.innerHTML = state.height.min;
    heightMax.innerHTML = state.height.max;
    heightCurr.innerHTML = state.height.current;
    hSlider.min = state.height.min;
    hSlider.max = state.height.max;
    hSlider.value = state.height.current;

    //Rendering based on conditions.
    
    if(state.output === true){
        renderBMIResult();
    }    

    //Setting event listeners.
    wSlider.addEventListener('input', event => {
        weightCurr.innerHTML = wSlider.value;
    })
    wSlider.addEventListener('change', event => {
        state.weight.current = wSlider.value;
        localStorage.setItem('w', state.weight.current.toString());
    })

    hSlider.addEventListener('input', event => {
        heightCurr.innerHTML = hSlider.value;
    })
    hSlider.addEventListener('change', event => {
        state.height.current = hSlider.value;
        localStorage.setItem('h', state.height.current.toString());
    })

    calcBtn.addEventListener('click', event => {
        let bmiResult = state.weight.current / Math.pow(state.height.current/100,2)
        if(Math.ceil(bmiResult) - bmiResult <= bmiResult - Math.floor(bmiResult)){
            bmiResult = Math.ceil(bmiResult)
        }else{
            bmiResult = Math.floor(bmiResult)
        }
        const color = getColor(bmiResult)
        const description = getDescription(bmiResult)
        
        state.result = {
            bmi: bmiResult,
            color: color,
            description: description
        };
        state.output = true;
        localStorage.setItem('result', JSON.stringify(state.result))
        localStorage.setItem('out', JSON.stringify(state.output))
        const bmiOut = getBMIOut(state.result);
        out.innerHTML = bmiOut;
        setOutCloseEventListener();

    })
    function setOutCloseEventListener() {
        const close = document.querySelector('.close-output');
        close.addEventListener('click', (e) => {
            const bmiCard = close.parentNode.parentElement;
            bmiCard.classList.remove('visible')
            bmiCard.classList.add('hide')
            bmiCard.addEventListener('animationend', (e) => {
                bmiCard.remove()
                state.output = false;
                localStorage.setItem('out', JSON.stringify(state.output))
                localStorage.setItem('result', JSON.stringify(null))
            });
        });
    }

    function renderBMIResult() {
        
        const bmiOut = getBMIOut (state.result);
        
        out.innerHTML = bmiOut;
        setOutCloseEventListener();
    }
});

function getWeight() {
    let w = localStorage.getItem('w');
    if(w === null){
        w = 70;
        localStorage.setItem('w', w.toString());
    }
    return w;
}

function getHeight() {
    let h = localStorage.getItem('h');
    if (h === null) {
        h = 170;
        localStorage.setItem('h', h.toString());
    }
    return h;
}

function getColor(bmi){
    if(bmi < 20 || bmi >= 25){
        return 'red';
    }
    return 'green';
}

function getDescription(bmi){
    if (bmi < 20 || bmi >= 25) {
        return 'Get in that range(21-24) kiddo!';
    }
    return 'Ya good to go!';
}

   

function getOutputState(){
    return JSON.parse(localStorage.getItem('out'))
}

function getResultState(){
    return JSON.parse(localStorage.getItem('result'))
}

function getBMIOut(result){
    const bmiOut = `
    <div class = "card ${result.color} visible">
                <div class = "card-main">
                    <button class = "close-output ${result.color}">&times;</button>
                    <h2>${result.bmi}</h2>
                    <p class = "description">${result.description}</p>
                </div>
            </div>
    `
    return bmiOut;
}
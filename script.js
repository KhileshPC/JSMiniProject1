const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';



let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");

// Set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
   return String.fromCharCode( getRndInteger(97,123));
}

function generateUpperrCase(){
    return String.fromCharCode( getRndInteger(65,91));
 }

 function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
 }

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) && 
        (hasNum || hasSym) && 
        passwordLength >= 6
        ) {
            setIndicator("#0ff0");
        } else {
            setIndicator("#f00");
        }
    }

    async function copyContent(){
        try{
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMsg.innerText = "copied";
        }
        catch(e){
            copyMsg.innerText = "failed";
        }
        //  to make copy wala span visible
        copyMsg.classList.add("active");

        setTimeout( () => {
            copyMsg.classList.remove("active");
        },2000);
       
    }

    function shufflePassword(array){
        //fisher yates method
        for(let i= array.length-1; i>0; i--){
            const j = Math.floor(Math.random() * (i+1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        let str = "";
        array.forEach((el) => (str += el));
        return str;
    }

        function handleCheckBoxChange() {
            checkCount = 0;
            allCheckBox.forEach( (checkbox) => {
                if(checkbox.checked)
                checkCount++;
            });
            
            //special conditon
            if(passwordLength < checkCount){
                passwordLength = checkCount;
                handleSlider();
            }
        }

        allCheckBox.forEach( (checkBox) => {
            checkBox.addEventListener('change' , handleCheckBoxChange);
        })

inputSlider.addEventListener ('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click' , ()=>{
    //none of th checkbox
    if(checkCount == 0)
     return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }


    //let statrt journey to find new password
    console.log("starting tje journey");

    //remove old password
    password = "";

    //lets put the stuff mentinoned by checkbox
    // if(uppercaseCheck.checked){
    //     password += generateUpperrCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperrCase);

        if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

        if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

        if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

        // compulsory addition
        for(let i=0;i<funcArr.length;i++){
            password += funcArr[i]();
        }
        console.log("compulsory addition done");

        //remaining  addition
        for(let i=0;i<passwordLength-funcArr.length;i++){
            let randIndex = getRndInteger(0, funcArr.length);
            console.log("randindex" + randIndex);
            password += funcArr[randIndex]();
        }
            console.log("Remaning addition done");
        //shuffle the password
        password = shufflePassword(Array.from(password));
        console.log("shuffling done");

        //show in UI
        passwordDisplay.value = password;
        console.log("UI addition done");

        //calulate strength
        calcStrength();
    
})

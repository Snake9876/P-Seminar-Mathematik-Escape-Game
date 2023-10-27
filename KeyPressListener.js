class KeyPressListener {
   constructor(keyCode, callback) {
     this.keydownFunction = function(event) {
       if (event.key === keyCode) {
         callback();
       }
     };
     this.keyupFunction = function(event) {
       if (event.key === keyCode) {
         // You might want to add code here to handle key release if needed.
       }
     };
     document.addEventListener("keydown", this.keydownFunction);
     document.addEventListener("keyup", this.keyupFunction);
   }
 
   unbind() {
     document.removeEventListener("keydown", this.keydownFunction);
     document.removeEventListener("keyup", this.keyupFunction);
   }
 }
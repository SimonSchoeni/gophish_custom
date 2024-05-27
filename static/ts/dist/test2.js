export var test;
(function (test) {
    class exportedFile {
        // Class method which prints the 
        // user called in another file 
        sayHello() {
            return "Hello!";
        }
    }
    test.exportedFile = exportedFile;
})(test || (test = {}));

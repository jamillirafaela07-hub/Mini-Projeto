// index.js
const readline = require('readline');
const manager = require('./estudantes');

// Interface para leitura de dados do terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log("\n--- Sistema de Gestão de Estudantes ---");
    console.log("1. Cadastrar novo estudante");
    console.log("2. Adicionar nota a um estudante");
    console.log("3. Buscar estudante por nome");
    console.log("4. Exibir média geral da turma");
    console.log("5. Exibir relatório de aprovação");
    console.log("6. Sair");
    rl.question("Escolha uma opção: ", handleOption);
}

function handleOption(option) {
    switch (option) {
        case '1':
            registerStudent();
            break;
        case '2':
            addGradeToStudent();
            break;
        case '3':
            findStudent();
            break;
        case '4':
            displayClassAverage();
            break;
        case '5':
            displayApprovalReport();
            break;
        case '6':
            rl.close();
            break;
        default:
            console.log("Opção inválida. Por favor, tente novamente.");
            showMenu();
            break;
    }
}

function registerStudent() {
    rl.question("Digite o nome do estudante: ", (name) => {
        rl.question("Digite a idade do estudante: ", (ageStr) => {
            const age = parseInt(ageStr, 10);
            if (manager.addStudent(name, age)) {
                showMenu();
            } else {
                registerStudent(); // Tenta novamente em caso de erro
            }
        });
    });
}

function addGradeToStudent() {
    rl.question("Digite o nome do estudante: ", (name) => {
        rl.question("Digite a nota (0-10): ", (gradeStr) => {
            const grade = parseFloat(gradeStr);
            if (manager.addGradeToStudent(name, grade)) {
                showMenu();
            } else {
                addGradeToStudent(); // Tenta novamente em caso de erro
            }
        });
    });
}

function findStudent() {
    rl.question("Digite o nome ou parte do nome do estudante: ", (name) => {
        const student = manager.findStudentByName(name);
        if (student) {
            console.log("\n--- Estudante Encontrado ---");
            console.log(`Nome: ${student.name}`);
            console.log(`Idade: ${student.age}`);
            console.log(`Notas: [${student.grades.join(', ')}]`);
            console.log(`Média: ${student.calculateAverage().toFixed(2)}`);
            console.log("----------------------------");
        } else {
            console.log("Nenhum estudante encontrado com esse nome.");
        }
        showMenu();
    });
}

function displayClassAverage() {
    const classAverage = manager.calculateClassAverage();
    console.log(`\nMédia geral da turma: ${classAverage.toFixed(2)}`);
    showMenu();
}

function displayApprovalReport() {
    const approved = manager.getApprovedStudents();
    const recovery = manager.getRecoveryStudents();
    const failed = manager.getFailedStudents();

    console.log("\n--- Relatório de Situação ---");
    console.log("Aprovados (média >= 7.0):");
    approved.forEach(s => console.log(` - ${s.name} (Média: ${s.calculateAverage().toFixed(2)})`));

    console.log("\nRecuperação (média entre 5.0 e 6.9):");
    recovery.forEach(s => console.log(` - ${s.name} (Média: ${s.calculateAverage().toFixed(2)})`));

    console.log("\nReprovados (média < 5.0):");
    failed.forEach(s => console.log(` - ${s.name} (Média: ${s.calculateAverage().toFixed(2)})`));

    showMenu();
}

// Inicia a aplicação
showMenu();
// estudantes.js
const { studentsData } = require('./data');

// Classe para representar um estudante
class Student {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.grades = [];
    }

    addGrade(grade) {
        this.grades.push(grade);
    }

    calculateAverage() {
        if (this.grades.length === 0) {
            return 0;
        }
        const sum = this.grades.reduce((total, grade) => total + grade, 0);
        return sum / this.grades.length;
    }
}

// Classe para gerenciar a coleção de estudantes
class StudentManager {
    constructor() {
        // transforma array em Map e converte para Student
        const map = new Map();
        for (const obj of studentsData) {
            const s = new Student(obj.name, obj.age);
            s.grades = obj.grades;
            map.set(s.name, s);
        }
        this.studentsData = map;
    }

    addStudent(name, age) {
        // Validações
        if (!name || typeof name !== 'string' || name.trim() === '') {
            console.log("Erro: O nome não pode ser vazio.");
            return false;
        }
        if (typeof age !== 'number' || age <= 0 || !Number.isInteger(age)) {
            console.log("Erro: A idade deve ser um número inteiro positivo.");
            return false;
        }
        // Validação adicional para evitar nomes duplicados no Map
        if (this.studentsData.has(name.trim())) {
            console.log("Erro: Já existe um estudante com esse nome.");
            return false;
        }

        const newStudent = new Student(name.trim(), age);
        this.studentsData.set(newStudent.name, newStudent);
        console.log(`Estudante '${newStudent.name}' cadastrado com sucesso!`);
        return true;
    }

    addGradeToStudent(studentName, grade) {
        // Validação da nota: entre 0 e 10.
        if (typeof grade !== 'number' || grade < 0 || grade > 10) {
            console.log("Erro: A nota deve ser um número entre 0 e 10.");
            return false;
        }

        const student = this.findStudentByName(studentName);
        if (student) {
            student.addGrade(grade);
            console.log(`Nota ${grade} adicionada para '${student.name}'.`);
            return true;
        } else {
            console.log(`Estudante com o nome '${studentName}' não encontrado.`);
            return false;
        }
    }

    // Busca de estudante por nome (case-insensitive e parcial)
    findStudentByName(name) {
        const searchTerm = name.toLowerCase();
        for (const student of this.studentsData.values()) {
            if (student.name.toLowerCase().includes(searchTerm)) {
                return student;
            }
        }
        return null;
    }
    
    // Método para encontrar o estudante com a maior média
    findStudentWithHighestAverage() {
        if (this.studentsData.size === 0) {
            return null;
        }

        let topStudent = null;
        let maxAverage = -1;

        for (const student of this.studentsData.values()) {
            const currentAverage = student.calculateAverage();
            if (currentAverage > maxAverage) {
                maxAverage = currentAverage;
                topStudent = student;
            }
        }
        return topStudent;
    }

    // Método para calcular a média geral da turma
    calculateClassAverage() {
        if (this.studentsData.size === 0) {
            return 0;
        }
        let totalAverages = 0;
        for (const student of this.studentsData.values()) {
            totalAverages += student.calculateAverage();
        }
        return totalAverages / this.studentsData.size;
    }

    // Métodos para relatórios de situação
    getApprovedStudents() {
        const approved = [];
        for (const student of this.studentsData.values()) {
            if (student.calculateAverage() >= 7.0) {
                approved.push(student);
            }
        }
        return approved;
    }

    getRecoveryStudents() {
        const recovery = [];
        for (const student of this.studentsData.values()) {
            const avg = student.calculateAverage();
            if (avg >= 5.0 && avg < 7.0) {
                recovery.push(student);
            }
        }
        return recovery;
    }

    getFailedStudents() {
        const failed = [];
        for (const student of this.studentsData.values()) {
            if (student.calculateAverage() < 5.0) {
                failed.push(student);
            }
        }
        return failed;
    }
}

module.exports = new StudentManager();

import { Injectable } from '@nestjs/common';
const fs = require('fs');

@Injectable()
export class TasksService {
    async findAll() {
        try {
            const jsonString = await fs.readFileSync("src/task/tasks.json", { encoding: "utf8" });
            return JSON.parse(jsonString);
        } catch (error) {
            console.log("Error parsing JSON string:", error);
            return [];
        }
    }
}
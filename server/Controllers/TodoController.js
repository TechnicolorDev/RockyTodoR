/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                     !TODO CONTROLLER!                                           //
//                    Do not edit anyting if you dont know what are you doing                      //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////

const { Todo } = require('../database/database');

class TodoController {
    static async create(req, res){
        try {
            const { name, description, dueDate, repoUrl } = req.body;

            if(!name || !description || !dueDate || !repoUrl) {
                return res.status(400).json({error: "All fields are required!"})
            }

            const newTodo = await Todo.create({
                name,
                description,
                dueDate,
                repoUrl,
                creationDate: new Date(),
            });

            res.status(201).json(newTodo);

        } catch (error) {
            console.error('Failed to create todo:', error);
            res.status(500).json({ error: 'Failed to create todo.' });
        }
    }

    static async getAll(req, res) {
        try{
            const todos = await  Todo.findAll();
            res.status(200).json(todos);

        } catch (error) {
            console.error('Failed to fetch todos:', error);
            res.status(500).json({ error: 'Failed to fetch todos.' });
        }
    }

    static async update(req , res) {
        const { todoId } = req.params;
        const { name, description, dueDate, repoUrl } = req.body;

        if(!name && !description && !dueDate && !repoUrl) {
            return res.status(400).json({
                error: "At least one field (name, description, dueDate, repoUrl) must be provided to update.",
            });
        }
        try {
            const todo = await Todo.findOne({where: {todoId: todoId}});

            if(!todo){
                return res.status(404).json({error: "Todo not found."});
            }

            if (name) todo.name = name;
            if (description) todo.description = description;
            if (dueDate) todo.dueDate = dueDate;
            if (repoUrl) todo.repoUrl = repoUrl;

            await todo.save();

            res.status(200).json({
                message: 'Todo updated successfully.',
                updatedTodo: todo,
            });

        } catch (error){
            console.log("Failed to update Todo with error message: ", error)
            res.status(500).json({error: "Failed to update todo"})
        }
    }

    static async delete(req, res) {
        try {
            const { todoId} = req.params;
            const todo = await Todo.findOne({where: {todoId}});

            if (!todo) {
                return res.status(404).json({ error: 'Todo not found.' });
            }

            await todo.destroy();
            res.status(200).json({ message: 'Todo deleted successfully.' });

        } catch (error){
            console.error('Failed to delete todo:', error);
            res.status(500).json({ error: 'Failed to delete todo.' });
        }
    }
}

module.exports = TodoController;
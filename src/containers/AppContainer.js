import React, { Component } from "react";
import App from "../components/App";
import axios from "axios";

class AppContainer extends Component {
    constructor() {
        super();

        this.state = {
            filterText: "",
            addText: "",
            isLoading: false,
            hasError: false,
            todos: []
        };
    }

    handleIsDoneToggle = async (todoId, isDone) => {
        try {
            this.setState({ isLoading: true });
            await axios.put("https://react.axilis.com/jurkovic/todo/", {
                id: todoId,
                isDone: isDone
            });
        } catch (err) {
            this.setState({ hasError: true });
        } finally {
            this.setState({ isLoading: false });
        }

        this.setState({
            todos: this.state.todos.map(todo => {
                if (todo.id === todoId) {
                    return { ...todo, isDone: isDone };
                } else {
                    return todo;
                }
            })
        });
    };

    onFilterTextChanged = text => {
        this.setState({
            filterText: text
        });
    };

    onAddTextChanged = text => {
        this.setState({
            addText: text
        });
    };

    handleAddButtonClick = async () => {
        if (this.state.addText.trim().length < 0) {
            return;
        }

        try {
            this.setState({ isLoading: true });
            let resp = await axios.post(
                "https://react.axilis.com/jurkovic/todo",
                {
                    text: this.state.addText
                }
            );

            this.setState({
                addText: "",
                filterText: "",
                todos: [
                    ...this.state.todos,
                    {
                        id: resp.data.id,
                        text: this.state.addText,
                        isDone: false
                    }
                ]
            });
        } catch (err) {
            this.setState({ hasError: true });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleTrashClicked = async todoId => {
        try {
            this.setState({ isLoading: true });
            await axios.delete(
                "https://react.axilis.com/jurkovic/todo/" + todoId
            );

            this.setState({
                todos: this.state.todos.filter(t => t.id !== todoId)
            });
        } catch (err) {
            this.setState({ hasError: true });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    async componentDidMount() {
        this.setState({ isLoading: true });
        try {
            let resp = await axios.get(
                "https://react.axilis.com/jurkovic/todos"
            );
            this.setState({
                todos: resp.data
            });
        } catch (err) {
            this.setState({ hasError: true });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    filter = (todos, filter) => {
        if (filter && filter.trim().length > 0) {
            return todos.filter(t => t.text.indexOf(filter) > -1);
        }
        return todos;
    };

    render() {
        return (
            <App
                filterText={this.state.filterText}
                addText={this.state.addText}
                isLoading={this.state.isLoading}
                hasError={this.state.hasError}
                todos={this.filter(this.state.todos, this.state.filterText)}
                handleIsDoneToggle={this.handleIsDoneToggle}
                handleTrashClicked={this.handleTrashClicked}
                onFilterTextChanged={this.onFilterTextChanged}
                onAddTextChanged={this.onAddTextChanged}
                handleAddButtonClick={this.handleAddButtonClick}
            />
        );
    }
}

export default AppContainer;

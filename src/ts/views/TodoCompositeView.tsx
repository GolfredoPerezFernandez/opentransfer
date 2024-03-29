/*
* TodoCompositeView.tsx
* Copyright: Microsoft 2018
*
* Main view that provides a composite view of todos on the left and
* details of the selected todo on the right.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import NavContextStore from '../stores/NavContextStore';
import * as NavModels from '../models/NavModels';
import { Colors } from '../app/Styles';

import CreateTodoPanel from './CreateTodoPanel';
import TodoListPanel from './TodoListPanel';
import TodoListPanel2 from './TodoListPanel2';
import ViewTodoPanel from './ViewTodoPanel';
import ViewTodoPanel2 from './ViewTodoPanel2';
import HomePanel from './HomePanel';
import CurrentUserStore from '../stores/CurrentUserStore';

export interface TodoCompositeViewProps extends RX.CommonProps {
    navContext: NavModels.TodoRootNavContext;
}

interface TodoCompositeViewState {
    isLogin: boolean
}

const _styles = {
    viewContainer: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
    }),
    leftPanelContainer: RX.Styles.createViewStyle({
        width: 400,
        flexDirection: 'column',
    }),
    rightPanelContainer: RX.Styles.createViewStyle({
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.grayF8,
    }),
};
export default class TodoCompositeView extends ComponentBase<TodoCompositeViewProps, TodoCompositeViewState> {
    protected _buildState(props: TodoCompositeViewProps, initState: boolean): Partial<TodoCompositeViewState> | undefined {
        const partialState: Partial<TodoCompositeViewState> = {
            isLogin: CurrentUserStore.getLogin(),
        };
        return partialState;
    }
    render(): JSX.Element | null {
        return (
            <RX.View style={_styles.viewContainer}>
                {this.state.isLogin == true ?
                    <RX.View style={_styles.leftPanelContainer}>
                        <TodoListPanel
                            selectedTodoId={this.props.navContext.todoList.selectedTodoId || ''}
                            onSelect={this._onSelectTodo}
                            onCreateNew={this._onCreateNewTodo}
                        />
                    </RX.View> : null}
                <RX.View style={_styles.rightPanelContainer}>
                    {this._renderRightPanel()}
                </RX.View>
                {this.state.isLogin == true ? <RX.View style={_styles.leftPanelContainer}>
                    <TodoListPanel2
                        selectedTodoId={this.props.navContext.todoList.selectedTodoId2 || ''}
                        onSelect={this._onSelectTodo2}
                        onCreateNew={this._onCreateNewTodo}
                    />
                </RX.View> : null}
            </RX.View>
        );
    }

    private _renderRightPanel() {
        if (this.props.navContext.showNewTodoPanel) {
            return (
                <CreateTodoPanel />
            );
        } else if (this.props.navContext.todoList.selectedTodoId) {
            return (
                <ViewTodoPanel todoId={this.props.navContext.todoList.selectedTodoId} />
            );
        } else if (this.props.navContext.todoList.selectedTodoId2) {
            return (
                <ViewTodoPanel2 todoId={this.props.navContext.todoList.selectedTodoId2} />
            );
        } else {
            return <HomePanel />;
        }
    }

    private _onSelectTodo2 = (todoId: string) => {
        console.log('entro')
        NavContextStore.navigateToTodoList(undefined, false, todoId);
    };
    private _onSelectTodo = (todoId: string) => {
        NavContextStore.navigateToTodoList(todoId, false);
    };

    private _onCreateNewTodo = () => {
        NavContextStore.navigateToTodoList('', true);
    };
}

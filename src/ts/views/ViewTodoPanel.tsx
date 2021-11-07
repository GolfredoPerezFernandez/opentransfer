/**
* ViewTodoPanel.tsx
* Copyright: Microsoft 2017
*
* The Todo item edit view.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import NavContextStore from '../stores/NavContextStore';
import SimpleButton from '../controls/SimpleButton';
import SimpleDialog from '../controls/SimpleDialog';
import { FontSizes } from '../app/Styles';
import { Owner, Todo, Transfer } from '../models/TodoModels';
import TodosStore from '../stores/TodosStore';
import CurrentUserStore from '../stores/CurrentUserStore';

export interface ViewTodoPanelProps extends RX.CommonProps {
    todoId: string;
}

interface ViewTodoPanelState {
    todo: Owner;
}

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        margin: 16,
    }),
    todoText: RX.Styles.createTextStyle({
        margin: 8,
        fontSize: FontSizes.size16,
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
    }),
    buttonContainer: RX.Styles.createViewStyle({
        margin: 8,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }),
};

const _confirmDeleteDialogId = 'delete';

export default class ViewTodoPanel extends ComponentBase<ViewTodoPanelProps, ViewTodoPanelState> {
    protected _buildState(props: ViewTodoPanelProps, initState: boolean): Partial<ViewTodoPanelState> {
        const newState: Partial<ViewTodoPanelState> = {
            todo: CurrentUserStore.getActive() === 'gold' ? TodosStore.getOwnerGoldById(props.todoId) : CurrentUserStore.getActive() === 'silver' ? TodosStore.getOwnerSilverById(props.todoId) : CurrentUserStore.getActive() === 'bronze' ? TodosStore.getOwnerBronzeById(props.todoId) : []
        };

        return newState;
    }

    render() {
        return (
            <RX.View useSafeInsets={true} style={_styles.container}>
                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.owner_of : ''}
                </RX.Text>
                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.token_id : ''}
                </RX.Text>

                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.amount : ''}
                </RX.Text>
                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.token_uri : ''}
                </RX.Text>

                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.contract_type : ''}
                </RX.Text>
                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.token_address : ''}
                </RX.Text>

            </RX.View>
        );
    }

    private _onPressDelete = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        const dialog = (
            <SimpleDialog
                dialogId={_confirmDeleteDialogId}
                text={'Are you sure you want to delete this todo?'}
                buttons={[{
                    text: 'Delete',
                    onPress: () => {
                        SimpleDialog.dismissAnimated(_confirmDeleteDialogId);
                        this._completeDelete();
                    },
                }, {
                    text: 'Cancel',
                    isCancel: true,
                    onPress: () => {
                        SimpleDialog.dismissAnimated(_confirmDeleteDialogId);
                    },
                }]}
            />
        );

        RX.Modal.show(dialog, _confirmDeleteDialogId);
    };

    private _completeDelete() {
        TodosStore.deleteTodo(this.state.todo.token_id);
        NavContextStore.navigateToTodoList();
    }
}

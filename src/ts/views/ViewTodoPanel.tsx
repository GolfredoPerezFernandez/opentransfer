/**
* ViewTodoPanel.tsx
* Copyright: Microsoft 2017
*
* The Todo item edit view.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import { FontSizes } from '../app/Styles';
import TodosStore from '../stores/TodosStore';
import CurrentUserStore from '../stores/CurrentUserStore';
import NavContextStore from '../stores/NavContextStore';

export interface ViewTodoPanelProps extends RX.CommonProps {
    todoId: string;
}

interface ViewTodoPanelState {
    todo: any;
    isLogin: boolean;
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


export default class ViewTodoPanel extends ComponentBase<ViewTodoPanelProps, ViewTodoPanelState> {
    protected _buildState(props: ViewTodoPanelProps, initState: boolean): Partial<ViewTodoPanelState> {
        const newState: Partial<ViewTodoPanelState> = {
            isLogin: CurrentUserStore.getLogin(),
            todo: CurrentUserStore.getActive() === 'gold' ? TodosStore.getOwnerGoldById(props.todoId) : CurrentUserStore.getActive() === 'silver' ? TodosStore.getOwnerSilverById(props.todoId) : CurrentUserStore.getActive() === 'bronze' ? TodosStore.getOwnerBronzeById(props.todoId) : []
        };

        return newState;
    }
    componentDidMount() {
        if (this.state.isLogin === true) {

        } else {
            NavContextStore.navigateToTodoList(undefined, false, undefined, true)
        }
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
}

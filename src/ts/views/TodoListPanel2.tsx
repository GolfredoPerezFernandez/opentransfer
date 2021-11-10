/**
* TodoListPanel.tsx
* Copyright: Microsoft 2018
*
* Display first screen of the Todo application.
*/

import * as _ from 'lodash';
import * as RX from 'reactxp';
import { VirtualListView, VirtualListViewItemInfo } from 'reactxp-virtuallistview';
import { VirtualListCellRenderDetails } from 'reactxp-virtuallistview/dist/VirtualListCell';
import { ComponentBase } from 'resub';

import { Colors, Fonts, FontSizes } from '../app/Styles';

import { Winner } from '../models/TodoModels';
import TodosStore from '../stores/TodosStore';

import TodoListItem2 from './TodoListItem2';

interface TodoListItemInfo extends VirtualListViewItemInfo {
    todo: Winner;
}

export interface TodoListPanelProps extends RX.CommonProps {
    selectedTodoId?: string;
    onSelect: (selectedId: string) => void;
    onCreateNew: () => void;
}

interface TodoListPanelState {
    todos: TodoListItemInfo[];
    filteredTodoList: TodoListItemInfo[];
    searchString: string;
    activeId: string;
    tokenAddress: string;
    winnersGold: Winner[]
    loading: boolean;
    winnersBronze: Winner[];
    winnersSilver: Winner[];
}

const _listItemHeight = 80;

const _styles = {
    listScroll: RX.Styles.createViewStyle({
        flexDirection: 'column',
        alignSelf: 'stretch',
        backgroundColor: Colors.contentBackground,
    }),
    todoListHeader2: RX.Styles.createViewStyle({
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    }),
    todoListHeader: RX.Styles.createViewStyle({
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    }),
    searchBox: RX.Styles.createTextInputStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size14,
        borderWidth: 1,
        borderColor: Colors.borderSeparator,
        flex: 1,
        padding: 4,
        marginLeft: 12,
    }),
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: Colors.contentBackground,
    }),
    addTodoButton: RX.Styles.createViewStyle({
        margin: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    }),
    text1: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        color: 'black',
    }),
    buttonText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        lineHeight: 32,
        color: Colors.buttonTextColor,
    }),
    buttonTextHover: RX.Styles.createTextStyle({
        color: Colors.buttonTextHover,
    }),

    label: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: FontSizes.size14,
        color: 'black',
    }),

};
import CurrentUserStore from '../stores/CurrentUserStore';

const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/server";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";
Moralis.start({ serverUrl, appId })

import * as UI from '@sproutch/ui';

import NavContextStore from '../stores/NavContextStore';
export default class TodoListPanel2 extends ComponentBase<TodoListPanelProps, TodoListPanelState> {
    protected _buildState(props: TodoListPanelProps, initState: boolean): Partial<TodoListPanelState> | undefined {
        const partialState: Partial<TodoListPanelState> = {
            tokenAddress: '0x256a7001f057d59cd792ff0a1e7d7c14bb0b19e6',

            winnersGold: TodosStore.getWinnersGold(),
            winnersSilver: TodosStore.getWinnersSilver(),
            winnersBronze: TodosStore.getWinnersBronze(),
            activeId: CurrentUserStore.getActive2(),
            loading: CurrentUserStore.getLoading(),
        };

        partialState.todos = CurrentUserStore.getActive2() === 'gold' ? TodosStore.getWinnersGold().map((todo, i) => ({
            key: i.toString(),
            height: _listItemHeight,
            template: 'todo',
            todo
        })) : CurrentUserStore.getActive2() === 'silver' ? TodosStore.getWinnersSilver().map((todo, i) => ({
            key: i.toString(),
            height: _listItemHeight,
            template: 'todo',
            todo,
        })) : TodosStore.getWinnersBronze().map((todo, i) => ({
            key: i.toString(),
            height: _listItemHeight,
            template: 'todo',
            todo,
        }));

        if (initState) {
            partialState.searchString = '';
            partialState.filteredTodoList = partialState.todos;
        } else {
            const filter = _.trim(partialState.searchString);
            if (filter) {
                partialState.filteredTodoList = this._filterTodoList(partialState.todos, filter);
            } else {
                partialState.filteredTodoList = partialState.todos;
            }
        }

        return partialState;
    }
    render() {
        return (
            <RX.View useSafeInsets={true} style={_styles.container}>



                {this.state.tokenAddress !== '' ? <RX.View style={_styles.todoListHeader2}>

                    <RX.Text style={[_styles.text1, {}]} >
                        {'Winners :'}
                    </RX.Text>
                </RX.View> : null}

                <RX.View style={{ flexDirection: 'row', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.activeId === 'gold' ?
                        <UI.Button onPress={() => this.goToGold()} palette='primary' style={{ root: [{}], content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'gray' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Gold " + "(" + this.state.winnersGold.length + ")"} /> :
                        <UI.Button onPress={() => this.goToGold()} style={{ content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'white' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Gold " + "(" + this.state.winnersGold.length + ")"} />}

                    {this.state.activeId === 'silver' ?
                        <UI.Button onPress={() => this.goToSilver()} palette='primary' style={{ root: [{}], content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'gray' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Silver " + "(" + this.state.winnersSilver.length + ")"} /> :
                        <UI.Button onPress={() => this.goToSilver()} style={{ content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'white' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Silver " + "(" + this.state.winnersSilver.length + ")"} />}

                    {this.state.activeId === 'bronze' ?
                        <UI.Button onPress={() => this.goToBronze()} palette={'primary'} style={{ content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'gray' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Bronze " + "(" + this.state.winnersBronze.length + ")"} /> :
                        <UI.Button onPress={() => this.goToBronze()} style={{ content: [{ borderRadius: 0, width: 133, borderWidth: 0, backgroundColor: 'white', }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Bronze " + "(" + this.state.winnersBronze.length + ")"} />}

                </RX.View>

                <VirtualListView
                    itemList={this.state.filteredTodoList}
                    renderItem={this._renderItem}
                    style={_styles.listScroll}
                />
            </RX.View>
        );
    }

    async goToGold() {

        NavContextStore.navigateToTodoList()
        CurrentUserStore.setActive2('gold')
    }
    async goToSilver() {

        NavContextStore.navigateToTodoList()
        CurrentUserStore.setActive2('silver')
    }
    async goToBronze() {

        NavContextStore.navigateToTodoList()
        CurrentUserStore.setActive2('bronze')
    }
    private _filterTodoList(sortedTodos: TodoListItemInfo[], searchString: string): TodoListItemInfo[] {
        const lowerSearchString = searchString.toLowerCase();

        return _.filter(sortedTodos, item => {
            const todoLower = item.todo.owner_of.toLowerCase();
            return todoLower.search(lowerSearchString) >= 0;
        });
    }

    private _renderItem = (details: VirtualListCellRenderDetails<TodoListItemInfo>) => {
        const item = details.item;
        return (
            <TodoListItem2
                todo={item.todo}
                height={_listItemHeight}
                isSelected={item.todo.owner_of === this.props.selectedTodoId}
                searchString={this.state.searchString}
                onPress={this._onPressTodo}
            />
        );
    };

    private _onPressTodo = (todoId: string) => {
        this.props.onSelect(todoId);
        console.log('todoId')
        this.setState({
            searchString: '',
            filteredTodoList: this.state.todos,
        });
    };

}

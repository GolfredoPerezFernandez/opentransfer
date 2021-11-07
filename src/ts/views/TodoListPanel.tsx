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

import { Owner } from '../models/TodoModels';
import TodosStore from '../stores/TodosStore';

import TodoListItem from './TodoListItem';

interface TodoListItemInfo extends VirtualListViewItemInfo {
    todo: Owner;
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
    randomNumber: number;
    newBuyers: number;
    tokenAddress: string;
    ownersDBGold: Owner[];
    ownersDBSilver: Owner[];
    ownersDBBronze: Owner[];
    ownersGold: number;
    ownersSilver: number;
    ownersBronze: number;
    loading: boolean;
}

const _listItemHeight = 48;

const _styles = {
    listScroll: RX.Styles.createViewStyle({
        flexDirection: 'column',
        alignSelf: 'stretch',
        backgroundColor: Colors.contentBackground,
    }),
    todoListHeader2: RX.Styles.createViewStyle({
        height: 120,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }),
    todoListHeader: RX.Styles.createViewStyle({
        height: 50,
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
import * as UI from '@sproutch/ui';
import CurrentUserStore from '../stores/CurrentUserStore';

const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/server";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";
Moralis.start({ serverUrl, appId })


export default class TodoListPanel extends ComponentBase<TodoListPanelProps, TodoListPanelState> {
    protected _buildState(props: TodoListPanelProps, initState: boolean): Partial<TodoListPanelState> | undefined {
        const partialState: Partial<TodoListPanelState> = {
            tokenAddress: '',
            ownersGold: TodosStore.getOwnersGold().length,
            ownersSilver: TodosStore.getOwnersSilver().length,
            ownersBronze: TodosStore.getOwnersBronze().length,
            ownersDBGold: TodosStore.getDBOwnersGold(),
            ownersDBSilver: TodosStore.getDBOwnersSilver(),
            ownersDBBronze: TodosStore.getDBOwnersBronze(),
            activeId: CurrentUserStore.getActive(),
            newBuyers: CurrentUserStore.getTotalBuyers(),
            loading: CurrentUserStore.getLoading(),
            randomNumber: CurrentUserStore.getRandomNumber(),
        };

        partialState.todos = CurrentUserStore.getActive() === 'gold' ? TodosStore.getOwnersGold().map((todo, i) => ({
            key: i.toString(),
            height: _listItemHeight,
            template: 'todo',
            todo
        })) : CurrentUserStore.getActive() === 'silver' ? TodosStore.getOwnersSilver().map((todo, i) => ({
            key: i.toString(),
            height: _listItemHeight,
            template: 'todo',
            todo,
        })) : TodosStore.getOwnersBronze().map((todo, i) => ({
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



                <RX.View style={_styles.todoListHeader}>

                    <UI.Button onPress={this._onPressCreateNewTodo} style={{ root: [{ marginLeft: 10, marginRight: 35 }], content: [{ height: 37, backgroundColor: 'white', width: 350, marginBottom: 5, borderRadius: 11, }], label: _styles.label }
                    } elevation={4} variant={"outlined"} label="Open Sea SDK" />

                </RX.View>


                <RX.View style={_styles.todoListHeader2}>




                    <RX.Text style={[_styles.text1, { marginTop: 20 }]} >
                        {'Total owners: ' + this.state.todos.length}
                    </RX.Text>

                    <RX.Text style={[_styles.text1, { marginTop: 10, marginBottom: 10 }]} >
                        {'New owners: ' + (this.state.activeId === "gold" ? Math.abs(this.state.todos.length - this.state.ownersDBGold.length) : this.state.activeId === "silver" ? Math.abs(this.state.todos.length - this.state.ownersDBSilver.length) : Math.abs(this.state.todos.length - this.state.ownersDBBronze.length))}
                    </RX.Text>
                    {(this.state.activeId === "gold" ? Math.abs(this.state.todos.length - this.state.ownersDBGold.length) : this.state.activeId === "silver" ? Math.abs(this.state.todos.length - this.state.ownersDBSilver.length) : Math.abs(this.state.todos.length - this.state.ownersDBBronze.length)) >= 10 ?
                        this.state.loading ? <UI.Spinner style={{ alignSelf: 'center' }} size='medium' color={'black'} /> : <UI.Button onPress={this.state.activeId === 'gold' ? this._onPressGold : this.state.activeId === 'silver' ? this._onPressSilver : this._onPressBronze} style={{ root: [{}], content: [{ height: 37, backgroundColor: 'white', width: 150, marginBottom: 5, borderRadius: 11, }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label="Get Winners" /> : null}
                </RX.View>

                <RX.View style={{ flexDirection: 'row', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.activeId === 'gold' ?
                        <UI.Button onPress={() => this.goToGold()} palette='primary' style={{ root: [{}], content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'gray' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Gold " + "(" + this.state.ownersGold + ")"} /> :
                        <UI.Button onPress={() => this.goToGold()} style={{ content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'white' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Gold " + "(" + this.state.ownersGold + ")"} />}

                    {this.state.activeId === 'silver' ?
                        <UI.Button onPress={() => this.goToSilver()} palette='primary' style={{ root: [{}], content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'gray' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Silver " + "(" + this.state.ownersSilver + ")"} /> :
                        <UI.Button onPress={() => this.goToSilver()} style={{ content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'white' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Silver " + "(" + this.state.ownersSilver + ")"} />}

                    {this.state.activeId === 'bronze' ?
                        <UI.Button onPress={() => this.goToBronze()} palette={'primary'} style={{ content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'gray' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Bronze " + "(" + this.state.ownersBronze + ")"} /> :
                        <UI.Button onPress={() => this.goToBronze()} style={{ content: [{ borderRadius: 0, width: 133, borderWidth: 0, backgroundColor: 'white', }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Bronze " + "(" + this.state.ownersBronze + ")"} />}

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

        CurrentUserStore.setActive('gold')
    }
    async goToSilver() {

        CurrentUserStore.setActive('silver')
    }
    async goToBronze() {

        CurrentUserStore.setActive('bronze')
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
            <TodoListItem
                todo={item.todo}
                height={_listItemHeight}
                isSelected={item.todo.token_id === this.props.selectedTodoId}
                searchString={this.state.searchString}
                onPress={this._onPressTodo}
            />
        );
    };

    private _onPressTodo = (todoId: string) => {
        this.props.onSelect(todoId);
        this.setState({
            searchString: '',
            filteredTodoList: this.state.todos,
        });
    };


    private _onPressBronze = async () => {
        const options3 = { address: "0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656", token_id: "16923634234309235305936278977612378847065311654836719990863808851027999851496", chain: "rinkeby" };
        CurrentUserStore.setLoading(true)
        let user = await Moralis.User.current();


        if (user) {

            const tokenIdOwnersGold = await Moralis.Web3API.token.getTokenIdOwners(options3);

            const Winner = Moralis.Object.extend("WinnersBronze");

            const Owner = Moralis.Object.extend("OwnersBronze");
            const query = new Moralis.Query(Owner)
            query.limit(500)
            const queryResults = await query.find();




            if ((tokenIdOwnersGold.result.length - queryResults.length) >= 10) {


                var resto = (tokenIdOwnersGold.result.length - queryResults.length) / 10;


                var fract = resto * 10 % 10 / 10; //0.2
                var integr = resto - fract; //


                const winner = new Winner();
                let counter = queryResults.length;

                if (integr >= 1) {
                    for (let i = 0; i < integr; i++) {

                        let rand = this.getRandomArbitrary(1, 0 + 11);

                        var fract = rand * 10 % 10 / 10; //0.2
                        var newint = rand - fract; //
                        let i = counter + Math.round(newint)
                        console.log("i " + i)
                        winner.save({
                            token_address: tokenIdOwnersGold.result[i].token_address,
                            token_id: tokenIdOwnersGold.result[i].token_id,
                            amount: tokenIdOwnersGold.result[i].amount,
                            owner_of: tokenIdOwnersGold.result[i].owner_of,
                            block_number: tokenIdOwnersGold.result[i].block_number,
                            block_number_minted: tokenIdOwnersGold.result[i].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[i].contract_type,
                            token_uri: tokenIdOwnersGold.result[i].token_uri,
                            metadata: tokenIdOwnersGold.result[i].metadata,
                            synced_at: tokenIdOwnersGold.result[i].synced_at,
                            name: tokenIdOwnersGold.result[i].name,
                            payed: false,
                            symbol: tokenIdOwnersGold.result[i].symbol,
                        })


                        TodosStore.addBronzeWinner({
                            token_address: tokenIdOwnersGold.result[i].token_address,
                            token_id: tokenIdOwnersGold.result[i].token_id,
                            amount: tokenIdOwnersGold.result[i].amount,
                            owner_of: tokenIdOwnersGold.result[i].owner_of,
                            block_number: tokenIdOwnersGold.result[i].block_number,
                            block_number_minted: tokenIdOwnersGold.result[i].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[i].contract_type,
                            token_uri: tokenIdOwnersGold.result[i].token_uri,
                            metadata: tokenIdOwnersGold.result[i].metadata,
                            synced_at: tokenIdOwnersGold.result[i].synced_at,
                            name: tokenIdOwnersGold.result[i].name,
                            payed: false,
                            symbol: tokenIdOwnersGold.result[i].symbol,
                        });

                        for (let j = 0; j < (counter + 10); j++) {

                            const owner = new Owner();
                            await owner.save({
                                token_address: tokenIdOwnersGold.result[j].token_address,
                                token_id: tokenIdOwnersGold.result[j].token_id,
                                amount: tokenIdOwnersGold.result[j].amount,
                                owner_of: tokenIdOwnersGold.result[j].owner_of,
                                block_number: tokenIdOwnersGold.result[j].block_number,
                                block_number_minted: tokenIdOwnersGold.result[j].block_number_minted,
                                contract_type: tokenIdOwnersGold.result[j].contract_type,
                                token_uri: tokenIdOwnersGold.result[j].token_uri,
                                metadata: tokenIdOwnersGold.result[j].metadata,
                                synced_at: tokenIdOwnersGold.result[j].synced_at,
                                name: tokenIdOwnersGold.result[j].name,
                                payed: false,
                                symbol: tokenIdOwnersGold.result[j].symbol,
                            })
                        }


                        counter = counter + 10
                    }


                    const ownedItems = await Moralis.Cloud.run('getDBBronze')
                    TodosStore.setDBOwnersBronze(ownedItems)
                    CurrentUserStore.setLoading(false)
                    return

                }
            }
            CurrentUserStore.setLoading(false)
            return


        }


        CurrentUserStore.setLoading(false)
        return

    };
    private _onPressSilver = async () => {
        const options3 = { address: "0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656", token_id: "16923634234309235305936278977612378847065311654836719990863808852127511479272", chain: "rinkeby" };
        CurrentUserStore.setLoading(true)
        let user = await Moralis.User.current();


        if (user) {

            const tokenIdOwnersGold = await Moralis.Web3API.token.getTokenIdOwners(options3);

            const Winner = Moralis.Object.extend("WinnersSilver");

            const Owner = Moralis.Object.extend("OwnersSilver");
            const query = new Moralis.Query(Owner)
            query.limit(500)
            const queryResults = await query.find();




            if ((tokenIdOwnersGold.result.length - queryResults.length) >= 10) {

                console.log('si ')

                var resto = (tokenIdOwnersGold.result.length - queryResults.length) / 10;


                var fract = resto * 10 % 10 / 10; //0.2
                var integr = resto - fract; //


                const winner = new Winner();
                let counter = queryResults.length;

                if (integr >= 1) {
                    for (let i = 0; i < integr; i++) {

                        let rand = this.getRandomArbitrary(1, 0 + 11);

                        var fract = rand * 10 % 10 / 10; //0.2
                        var newint = rand - fract; //
                        let i = counter + Math.round(newint)
                        console.log("i " + i)
                        winner.save({
                            token_address: tokenIdOwnersGold.result[i].token_address,
                            token_id: tokenIdOwnersGold.result[i].token_id,
                            amount: tokenIdOwnersGold.result[i].amount,
                            owner_of: tokenIdOwnersGold.result[i].owner_of,
                            block_number: tokenIdOwnersGold.result[i].block_number,
                            block_number_minted: tokenIdOwnersGold.result[i].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[i].contract_type,
                            token_uri: tokenIdOwnersGold.result[i].token_uri,
                            metadata: tokenIdOwnersGold.result[i].metadata,
                            synced_at: tokenIdOwnersGold.result[i].synced_at,
                            name: tokenIdOwnersGold.result[i].name,
                            payed: false,
                            symbol: tokenIdOwnersGold.result[i].symbol,
                        })


                        TodosStore.addSilverWinner({
                            token_address: tokenIdOwnersGold.result[i].token_address,
                            token_id: tokenIdOwnersGold.result[i].token_id,
                            amount: tokenIdOwnersGold.result[i].amount,
                            owner_of: tokenIdOwnersGold.result[i].owner_of,
                            block_number: tokenIdOwnersGold.result[i].block_number,
                            block_number_minted: tokenIdOwnersGold.result[i].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[i].contract_type,
                            token_uri: tokenIdOwnersGold.result[i].token_uri,
                            metadata: tokenIdOwnersGold.result[i].metadata,
                            synced_at: tokenIdOwnersGold.result[i].synced_at,
                            name: tokenIdOwnersGold.result[i].name,
                            payed: false,
                            symbol: tokenIdOwnersGold.result[i].symbol,
                        });

                        for (let j = 0; j < (counter + 10); j++) {

                            const owner = new Owner();
                            await owner.save({
                                token_address: tokenIdOwnersGold.result[j].token_address,
                                token_id: tokenIdOwnersGold.result[j].token_id,
                                amount: tokenIdOwnersGold.result[j].amount,
                                owner_of: tokenIdOwnersGold.result[j].owner_of,
                                block_number: tokenIdOwnersGold.result[j].block_number,
                                block_number_minted: tokenIdOwnersGold.result[j].block_number_minted,
                                contract_type: tokenIdOwnersGold.result[j].contract_type,
                                token_uri: tokenIdOwnersGold.result[j].token_uri,
                                metadata: tokenIdOwnersGold.result[j].metadata,
                                synced_at: tokenIdOwnersGold.result[j].synced_at,
                                name: tokenIdOwnersGold.result[j].name,
                                payed: false,
                                symbol: tokenIdOwnersGold.result[j].symbol,
                            })
                        }


                        counter = counter + 10
                    }


                    const ownedItems = await Moralis.Cloud.run('getDBSilver')
                    TodosStore.setDBOwnersSilver(ownedItems)
                    CurrentUserStore.setLoading(false)
                    return

                }
            }
            CurrentUserStore.setLoading(false)
            return


        }


        CurrentUserStore.setLoading(false)
        return
    };
    private getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
    private _onPressGold = async () => {
        const options3 = { address: "0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656", token_id: "16923634234309235305936278977612378847065311654836719990863808853227023106548", chain: "rinkeby" };
        CurrentUserStore.setLoading(true)
        let user = await Moralis.User.current();


        if (user) {

            const tokenIdOwnersGold = await Moralis.Web3API.token.getTokenIdOwners(options3);

            const Winner = Moralis.Object.extend("WinnersGold");

            const Owner = Moralis.Object.extend("OwnersGold");
            const query = new Moralis.Query(Owner)
            query.limit(500)
            const queryResults = await query.find();




            if ((tokenIdOwnersGold.result.length - queryResults.length) >= 10) {

                console.log('si ')

                var resto = (tokenIdOwnersGold.result.length - queryResults.length) / 10;


                var fract = resto * 10 % 10 / 10; //0.2
                var integr = resto - fract; //


                const winner = new Winner();
                let counter = queryResults.length;

                if (integr >= 1) {
                    for (let i = 0; i < integr; i++) {

                        console.log("counter " + counter)
                        let rand = this.getRandomArbitrary(1, 0 + 11);

                        var fract = rand * 10 % 10 / 10; //0.2
                        var newint = rand - fract; //
                        let i = counter + Math.round(newint)
                        winner.save({
                            token_address: tokenIdOwnersGold.result[i].token_address,
                            token_id: tokenIdOwnersGold.result[i].token_id,
                            amount: tokenIdOwnersGold.result[i].amount,
                            owner_of: tokenIdOwnersGold.result[i].owner_of,
                            block_number: tokenIdOwnersGold.result[i].block_number,
                            block_number_minted: tokenIdOwnersGold.result[i].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[i].contract_type,
                            token_uri: tokenIdOwnersGold.result[i].token_uri,
                            metadata: tokenIdOwnersGold.result[i].metadata,
                            synced_at: tokenIdOwnersGold.result[i].synced_at,
                            name: tokenIdOwnersGold.result[i].name,
                            payed: false,
                            symbol: tokenIdOwnersGold.result[i].symbol,
                        })


                        TodosStore.addGoldWinner({
                            token_address: tokenIdOwnersGold.result[i].token_address,
                            token_id: tokenIdOwnersGold.result[i].token_id,
                            amount: tokenIdOwnersGold.result[i].amount,
                            owner_of: tokenIdOwnersGold.result[i].owner_of,
                            block_number: tokenIdOwnersGold.result[i].block_number,
                            block_number_minted: tokenIdOwnersGold.result[i].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[i].contract_type,
                            token_uri: tokenIdOwnersGold.result[i].token_uri,
                            metadata: tokenIdOwnersGold.result[i].metadata,
                            synced_at: tokenIdOwnersGold.result[i].synced_at,
                            name: tokenIdOwnersGold.result[i].name,
                            payed: false,
                            symbol: tokenIdOwnersGold.result[i].symbol,
                        });

                        for (let j = 0; j < (counter + 10); j++) {

                            const owner = new Owner();
                            await owner.save({
                                token_address: tokenIdOwnersGold.result[j].token_address,
                                token_id: tokenIdOwnersGold.result[j].token_id,
                                amount: tokenIdOwnersGold.result[j].amount,
                                owner_of: tokenIdOwnersGold.result[j].owner_of,
                                block_number: tokenIdOwnersGold.result[j].block_number,
                                block_number_minted: tokenIdOwnersGold.result[j].block_number_minted,
                                contract_type: tokenIdOwnersGold.result[j].contract_type,
                                token_uri: tokenIdOwnersGold.result[j].token_uri,
                                metadata: tokenIdOwnersGold.result[j].metadata,
                                synced_at: tokenIdOwnersGold.result[j].synced_at,
                                name: tokenIdOwnersGold.result[j].name,
                                payed: false,
                                symbol: tokenIdOwnersGold.result[j].symbol,
                            })
                        }


                        counter = counter + 10
                    }


                    const ownedItems = await Moralis.Cloud.run('getDBGold')
                    TodosStore.setDBOwnersGold(ownedItems)
                    CurrentUserStore.setLoading(false)
                    return

                }
            }
            CurrentUserStore.setLoading(false)
            return


        }


        CurrentUserStore.setLoading(false)
        return
    }
    private _onPressCreateNewTodo = async () => {

        this.props.onCreateNew();
        this.setState({
            searchString: '',
            filteredTodoList: this.state.todos,
        });
    };
}

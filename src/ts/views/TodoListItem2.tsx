/*
* TodoListItem.tsx
* Copyright: Microsoft 2018
*
* Renders a list item that represents a todo item.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import HoverButton from '../controls/HoverButton';
import { Colors, Fonts, FontSizes } from '../app/Styles';
import { Winner, } from '../models/TodoModels';
import TodosStore from '../stores/TodosStore';
import NavContextStore from '../stores/NavContextStore';

interface TodoListItemProps extends RX.CommonProps {
    height: number;
    todo: Winner;
    isSelected: boolean;
    searchString?: string;
    onPress: (todoId: string) => void;
}

interface TodoListItemState {
    isWinners: boolean;
    heightStyle: RX.Types.ViewStyleRuleSet;
}

const _itemBorderWidth = 1;

const _styles = {
    container: RX.Styles.createButtonStyle({
        alignSelf: 'stretch',
        borderBottomWidth: _itemBorderWidth,
        borderColor: Colors.borderSeparatorLight,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: Colors.white,
    }),
    todoNameText: RX.Styles.createTextStyle({
        flex: -1,
        fontSize: FontSizes.size16,
        font: Fonts.displayRegular,
        color: 'black',
        margin: 8,
    }),
    todoNameTextSelected: RX.Styles.createTextStyle({
        font: Fonts.displaySemibold,
        color: Colors.menuTextSelected,
    }),
    todoImage: RX.Styles.createImageStyle({
        marginLeft: 16,
        marginRight: 4,
        height: 20,
        width: 24,
    }),
    hovering: RX.Styles.createButtonStyle({
        backgroundColor: Colors.listItemHover,
    }),
    selected: RX.Styles.createButtonStyle({
        backgroundColor: Colors.listItemSelected,
    }),
};

export default class TodoListItem2 extends ComponentBase<TodoListItemProps, TodoListItemState> {
    protected _buildState(props: TodoListItemProps, initState: boolean): Partial<TodoListItemState> | undefined {
        const partialState: Partial<TodoListItemState> = {
            isWinners: TodosStore.getIsWinners(),
            heightStyle: RX.Styles.createViewStyle({
                height: props.height,
            }, false),
        };
        return partialState;
    }

    render(): JSX.Element | null {
        return (
            <HoverButton
                onRenderChild={this._onRenderItem}
                onPress={this._onPress} />
        );
    }

    private _onPress = (e: RX.Types.SyntheticEvent) => {
        // Prevent VirtualListView.onItemSelected from
        // being triggering in the web app.


        e.stopPropagation();
        console.log("desde winner");
        if (this.state.isWinners === true) {
            NavContextStore.navigateToTodoList(undefined, false, this.props.todo.owner_of, false)

        } else {
            NavContextStore.navigateToTodoList(this.props.todo.owner_of, false, undefined, false)
        }
        this.props.onPress(this.props.todo.owner_of);
    };

    private _onRenderItem = (isHovering: boolean) => {
        const buttonStyles = [_styles.container, this.state.heightStyle];
        if (this.props.isSelected) {
            buttonStyles.push(_styles.selected);
        } else if (isHovering) {
            buttonStyles.push(_styles.hovering);
        }

        let nameText: JSX.Element;
        const searchString = this.props.searchString ? this.props.searchString.trim().toLowerCase() : '';
        let searchSubstrIndex = -1;
        if (searchString) {
            searchSubstrIndex = this.props.todo.owner_of.toLowerCase().indexOf(searchString);
        }

        if (searchSubstrIndex >= 0) {
            nameText = (
                <RX.Text style={_styles.todoNameText} numberOfLines={1}>
                    <RX.Text numberOfLines={1}>
                        {this.props.todo.owner_of.substr(0, searchSubstrIndex)}
                    </RX.Text>
                    <RX.Text style={_styles.todoNameTextSelected} numberOfLines={1}>
                        {this.props.todo.owner_of.substr(searchSubstrIndex, searchString.length)}
                    </RX.Text>
                    <RX.Text numberOfLines={1}>
                        {this.props.todo.owner_of.substr(searchSubstrIndex + searchString.length)}
                    </RX.Text>
                </RX.Text>
            );
        } else {
            nameText = (
                <RX.Text style={_styles.todoNameText} numberOfLines={1}>
                    {this.props.todo.owner_of}
                </RX.Text>
            );
        }
        return (
            <RX.View style={buttonStyles}>
                <RX.Text style={_styles.todoNameText} numberOfLines={1}>
                    {nameText}
                </RX.Text>
                <RX.Text style={_styles.todoNameText} numberOfLines={1}>
                    {"payout " + this.props.todo.payed}
                </RX.Text>
            </RX.View>
        );
    };
}

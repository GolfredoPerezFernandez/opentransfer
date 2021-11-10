/**
* CreateTodoPanel.tsx
* Copyright: Microsoft 2017
*
* The Todo item edit view.
*/

import * as RX from 'reactxp';
import { FontSizes, Styles } from '../app/Styles';
import CurrentUserStore from '../stores/CurrentUserStore';
import NavContextStore from '../stores/NavContextStore';
import { CreateTodoHook } from './CreateTodoHook';

interface CreateTodoPanelProps extends RX.CommonProps {
}

interface CreateTodoPanelState {
    todoText?: string;
    isLogin: boolean;
}

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        padding: 16,
    }),
    editTodoItem: RX.Styles.createTextInputStyle({
        margin: 8,
        height: 32,
        paddingHorizontal: 4,
        fontSize: FontSizes.size16,
        alignSelf: 'stretch',
    }),
    buttonContainer: RX.Styles.createViewStyle({
        margin: 8,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }),
};

export default class CreateTodoPanel extends RX.Component<CreateTodoPanelProps, CreateTodoPanelState> {
    protected _buildState(props: CreateTodoPanelProps, initState: boolean): Partial<CreateTodoPanelState> {
        const partialState: Partial<CreateTodoPanelState> = {
            isLogin: CurrentUserStore.getLogin()
        };
        return partialState;
    }
    componentDidMount() {
        if (this.state.isLogin === true) {

        } else {
            NavContextStore.navigateToTodoList(undefined, false, undefined, true)
        }
    }
    render() {
        return (
            <RX.View useSafeInsets={true} style={[_styles.container, Styles.statusBarTopMargin]}>
                <CreateTodoHook width={0} height={0} isTiny={false} />
            </RX.View>
        );
    }

}

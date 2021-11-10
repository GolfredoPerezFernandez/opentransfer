/*
* AccountMenuButton.tsx
* Copyright: Microsoft 2018
*
* Button that displays the currently-signed-in user and provides
* a popup menu that allows the user to sign out, adjust account
* settings, etc.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import SimpleMenu, { MenuItem } from '../controls/SimpleMenu';
import { Colors, Fonts, FontSizes, } from '../app/Styles';

const _styles = {
    background: RX.Styles.createViewStyle({
        height: 75,
        width: 150,
        borderBottomWidth: 1,
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }),
    logoContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        marginLeft: 5,
        alignItems: 'flex-start',
    }),
    barControlsContainer: RX.Styles.createViewStyle({
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }),
    logoImage: RX.Styles.createImageStyle({
        height: 24,
        width: 26,
    }),
    logoText: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: FontSizes.size20,
        marginLeft: 10,
        color: Colors.logoColor,
    }),
    logoText2: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: FontSizes.size20,
        marginLeft: 0,
        color: '#FF296D',
    }),
    linkText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.menuItem,
        marginHorizontal: 8,
        color: Colors.menuText,
    }),
    linkTextHover: RX.Styles.createTextStyle({
        color: Colors.menuTextHover,
    }),
    backButtonContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
    }),
    backText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        color: Colors.menuText,
    }),
    label: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: FontSizes.size14,
        color: 'black',
    })
}
interface AccountMenuButtonState {
    currentUserName: string;
    isHovering: boolean;
}

interface AccountMenuButtonProps {
    username: string;
    onLogOut(): any;
    avatar: string;
    onPress: (todoId: string) => void;
}
const _menuPopupId = 'accountMenu';


const Moralis = require('moralis');
Moralis.initialize("kVVoRWButUY31vShqdGGQmiya4L0n3kF5aRTUVXk");
Moralis.serverURL = 'https://qqdpez4ourk2.moralishost.com:2053/server'

import * as UI from '@sproutch/ui';
import NavContextStore from '../stores/NavContextStore';
export default class AccountMenuButton2 extends ComponentBase<AccountMenuButtonProps, AccountMenuButtonState> {
    private _mountedButton: any;

    protected _buildState(props: AccountMenuButtonProps, initState: boolean): Partial<AccountMenuButtonState> | undefined {
        const partialState: Partial<AccountMenuButtonState> = {

        };

        return partialState;
    }

    render(): JSX.Element | null {
        let leng = this.props.username.length
        return (
            <UI.Button ref={this._onMountButton} onPress={this._onPress} style={{ root: [{}], content: [{ width: 150, justifyContent: 'center', alignItems: 'center', borderRadius: 11, }], label: _styles.label }
            } elevation={4} variant={"outlined"} label={this.props.username.length > 8 ? this.props.username.substring(0, 5).toUpperCase() + '...' + this.props.username.substring(leng - 5, leng).toUpperCase() : this.props.username} />


        );
    }

    private _onMountButton = (elem: any) => {
        this._mountedButton = elem;
    };

    private _onPress = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        RX.Popup.show({
            getAnchor: () => this._mountedButton,
            getElementTriggeringPopup: () => this._mountedButton,
            renderPopup: (anchorPosition: RX.Types.PopupPosition, anchorOffset: number, popupWidth: number, popupHeight: number) => {
                const items: MenuItem[] = [{
                    command: 'Edit Profile',
                    text: 'Edit Profile',
                }, {
                    command: '',
                    text: '-',
                }, {
                    command: 'Log Out',
                    text: 'Log Out',
                }];

                return (
                    <SimpleMenu
                        menuItems={items}
                        onSelectItem={this._onSelectMenuItem}
                    />
                );
            },
            dismissIfShown: true,
        }, _menuPopupId);
    };

    private _onSelectMenuItem = async (command: string) => {
        RX.Popup.dismiss(_menuPopupId);
        switch (command) {
            case 'Edit Profile':

            case 'Log Out':

                return this.props.onLogOut()



            default:
                return NavContextStore.navigateToTodoList(undefined, false, undefined, true)
        }

        // TODO - need to implement
    };
}

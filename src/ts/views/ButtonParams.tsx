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

import CurrentUserStore from '../stores/CurrentUserStore';
import SimpleMenuParams, { MenuItem } from '../controls/SimpleMenuParams';
import { Colors, Fonts, FontSizes } from '../app/Styles';

import ResponsiveWidthStore from '../stores/ResponsiveWidthStore';
interface AccountMenuButtonState {
    currentUserName: string;
    isHovering: boolean;
    command: string;
    isTiny: boolean

}
interface AccountMenuButtonProps {
    isChanged: (type: string) => void;
    type?: string

}


const _menuPopupId = 'accountMenu';

const _styles = {
    buttonContainer: RX.Styles.createButtonStyle({
        paddingHorizontal: 4,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    }),
    menuImage: RX.Styles.createImageStyle({
        height: 40,
        width: 40,
    }),
    nameText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.menuItem,
        marginHorizontal: 8,
        color: Colors.menuText,
    }),
    nameTextHover: RX.Styles.createTextStyle({
        color: Colors.menuTextHover,
    }),
    circleGlyph: RX.Styles.createViewStyle({
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.menuText,
        backgroundColor: Colors.logoColor,
    }),
    circleGlyphHover: RX.Styles.createViewStyle({
        borderColor: Colors.menuTextHover,
    }),
    text3: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: 13,
        color: 'white',
    }),
};

import SimpleButtonParams from '../controls/SimpleButtonParams';
import TodosStore from '../stores/TodosStore';
export default class ButtonParams extends ComponentBase<AccountMenuButtonProps, AccountMenuButtonState> {
    private _mountedButton: any;

    protected _buildState(props: AccountMenuButtonProps, initState: boolean): Partial<AccountMenuButtonState> | undefined {
        const partialState: Partial<AccountMenuButtonState> = {
            currentUserName: CurrentUserStore.getFullName(),
            command: 'Select an type of measurement',
            isTiny: ResponsiveWidthStore.isSmallOrTinyScreenSize(),
        };

        return partialState;
    }

    render(): JSX.Element | null {
        return (
            <SimpleButtonParams ref={this._onMountButton}
                onPress={this._onPress}
                text={this.command} textStyle={_styles.text3} buttonStyle={[{ justifyContent: 'center', borderWidth: 0, alignItems: 'center', width: 320, height: this.state.isTiny ? 37 : 47, marginTop: 0, backgroundColor: '#292558', borderRadius: 10 }]} />

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
                    command: 'Reflectance',
                    text: 'Reflectance',
                }, {
                    command: 'Absorbance',
                    text: 'Absorbance',
                }, {
                    command: 'Transmission',
                    text: 'Transmission',
                }, {
                    command: 'Dielectric Function',
                    text: 'Dielectric Function',
                }, {
                    command: 'Electrical Conductivity',
                    text: 'Electrical Conductivity',
                }, {
                    command: 'Termal Conductivity',
                    text: 'Termal Conductivity',
                }, {
                    command: 'Refraction Index',
                    text: 'Refraction Index',
                }, {
                    command: 'Impedance',
                    text: 'Impedance',
                }];

                return (
                    <SimpleMenuParams
                        menuItems={items}
                        onSelectItem={this._onSelectMenuItem}
                    />
                );
            },
            dismissIfShown: true,
        }, _menuPopupId);
    };
    command = 'Select an type of measurement'
    private _onSelectMenuItem = (command: string) => {
        this.command = command
        if (this.props.isChanged) {
            this.props.isChanged(command);
        }
        TodosStore.setType(command);
        RX.Popup.dismiss(_menuPopupId);
        // TODO - need to implement
    };
}

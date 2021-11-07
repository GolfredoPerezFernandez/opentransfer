/**
* AppBootstrapper.tsx
* Copyright: Microsoft 2018
*
* Main entry point for the app, common to both native and web.
*/

import { DbProvider } from 'nosqlprovider';
import * as RX from 'reactxp';
import * as SyncTasks from 'synctasks';

import NavContextStore from '../stores/NavContextStore';
import PageUrlService from '../services/PageUrlService';
import ResponsiveWidthStore from '../stores/ResponsiveWidthStore';
import RootView from '../views/RootView';
import ServiceManager, { Service } from '../services/ServiceManager';
import ServiceRegistrar from '../services/ServiceRegistrar';
import TodosStore from '../stores/TodosStore';
import { MoralisProvider } from "react-moralis";
import LocalDb from './LocalDb';
import DeepLinkConverter from './DeepLinkConverter';
import AppConfig from './AppConfig';

const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/server";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";
export default abstract class AppBootstrapper {
    constructor() {
        RX.App.initialize(__DEV__, __DEV__);

        ServiceRegistrar.init();

        // Open the DB and startup any critical services before displaying the UI.
        LocalDb.open(this._getDbProvidersToTry()).then(() => this._startCriticalServices()).then(() => {
            RX.UserInterface.setMainView(this._renderRootView());

            // Convert the initial URL into a navigation context.
            this._getInitialUrl().then(url => {
                if (url) {
                    const context = DeepLinkConverter.getContextFromUrl(url, NavContextStore.isUsingStackNav());
                    if (context) {
                        NavContextStore.setNavContext(context);
                    }
                }
            });
        });
    }

    private _startCriticalServices(): SyncTasks.Promise<void> {
        const servicesToStart: Service[] = [TodosStore];
        this.winnersSubscription()
        if (AppConfig.getPlatformType() === 'web') {
            servicesToStart.push(PageUrlService);
        }

        return ServiceManager.ensureStarted(servicesToStart);
    }
    private _renderRootView() {
        return (<MoralisProvider appId="eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC" serverUrl="https://kyyslozorkna.usemoralis.com:2053/server">

            <RootView
                onLayout={this._onLayoutRootView}
            />
        </MoralisProvider>
        );
    }

    winnersSubscription = async () => {

        const query = new Moralis.Query('Winners');
        let subscription = await query.subscribe()
        subscription.on('create', this.onWinnerCreated)
    }


    onWinnerCreated = async (item: any) => {
        let user = await Moralis.User.current();
        console.log(item.attributes)
        if (user) {
            let win = {
                token_address: item.attributes.token_address,
                token_id: item.attributes.token_id,
                amount: item.attributes.amount,
                owner_of: item.attributes.owner_of,
                block_number: item.attributes.block_number,
                block_number_minted: item.attributes.block_number_minted,
                contract_type: item.attributes.contract_type,
                token_uri: item.attributes.token_uri,
                metadata: item.attributes.metadata,
                synced_at: item.attributes.synced_at,
                name: item.attributes.name,
                symbol: item.attributes.symbol
            }
            TodosStore.addWinner(win)
            NavContextStore.navigateToTodoList()






        }

    }
    private _onLayoutRootView = (e: RX.Types.ViewOnLayoutEvent) => {
        const { width, height } = e;
        ResponsiveWidthStore.putWindowSize(width, height);
    };

    // Subclasses must override.
    protected abstract _getDbProvidersToTry(): DbProvider[];
    protected abstract _getInitialUrl(): SyncTasks.Promise<string | undefined>;
}

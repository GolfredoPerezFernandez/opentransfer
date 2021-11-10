/*
* NavActions.tsx
* Copyright: Microsoft 2018
*
* Constructs navigation contexts.
*/

import * as NavModels from '../models/NavModels';

export default class NavActions {
    static createTodoListContext(useStackNav: boolean, selectedTodoId?: string, showNewTodoPanel = false, selectedTodoId2?: string,showHomePanel=false) {
        if (useStackNav) {
            const navContext = new NavModels.StackRootNavContext();
            navContext.stack.push(new NavModels.TodoListViewNavContext(selectedTodoId,selectedTodoId2));
            if (showNewTodoPanel) {
                navContext.stack.push(new NavModels.NewTodoViewNavContext());
            } else if (selectedTodoId !== undefined) {
                navContext.stack.push(new NavModels.ViewTodoViewNavContext(selectedTodoId));
            }else if (selectedTodoId2 !== undefined) {
                navContext.stack.push(new NavModels.ViewTodoViewNavContext2(selectedTodoId2));
            }else if (showHomePanel) {
                navContext.stack.push(new NavModels.HomeViewNavContext());
            }
            return navContext;
        } else {
            return new NavModels.TodoRootNavContext(selectedTodoId, showNewTodoPanel,selectedTodoId2,showHomePanel);
        }
    }
}

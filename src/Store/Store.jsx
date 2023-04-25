import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import rootSaga from './Sagas';
import { Reducers } from './Reducers';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(Reducers, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export { store };

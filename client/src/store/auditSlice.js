import { createSlice } from '@reduxjs/toolkit';

const auditSlice = createSlice({
    name: 'audit',
    initialState: {
        audit: []
    },
    reducers: {
        addAuditLog: (state, action) => {
            state.audit.push(action.payload);
        },
        clearAuditLogs: (state) => {
            state.audit = [];
        },
        getAuditLogs: (state, action) => {
            return state.audit;
        },
        initialAddAudits: (state, action) => {
            state.audit = action.payload;
        }
    }
});

export const auditActions = auditSlice.actions;
export default auditSlice;

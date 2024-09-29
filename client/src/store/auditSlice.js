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
        }
    }
});

export const auditActions = auditSlice.actions;
export default auditSlice;

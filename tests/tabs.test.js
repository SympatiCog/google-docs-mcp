// tests/tabs.test.js
import { addTab } from '../dist/googleDocsApiHelpers.js';
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';

describe('Tab Management', () => {
    describe('addTab', () => {
        it('should create a request to add a tab with default title', async () => {
            const mockDocs = {
                documents: {
                    batchUpdate: mock.fn(async () => ({
                        data: {
                            replies: [
                                {
                                    addDocumentTab: {
                                        tabId: 'new-tab-id'
                                    }
                                }
                            ]

                        }
                    }))
                }
            };

            const result = await addTab(mockDocs, 'doc123');

            // Verify response structure
            assert.strictEqual(result.replies[0].addDocumentTab.tabId, 'new-tab-id');

            // Verify call structure
            assert.strictEqual(mockDocs.documents.batchUpdate.mock.calls.length, 1);
            const callArgs = mockDocs.documents.batchUpdate.mock.calls[0].arguments[0];

            assert.strictEqual(callArgs.documentId, 'doc123');
            assert.strictEqual(callArgs.requestBody.requests.length, 1);

            const request = callArgs.requestBody.requests[0];
            assert.deepStrictEqual(request.addDocumentTab.tabProperties, { title: 'New Tab' });
        });

        it('should create a request to add a tab with custom title', async () => {
            const mockDocs = {
                documents: {
                    batchUpdate: mock.fn(async () => ({ data: {} }))
                }
            };

            await addTab(mockDocs, 'doc123', 'My Custom Tab');

            const callArgs = mockDocs.documents.batchUpdate.mock.calls[0].arguments[0];
            const request = callArgs.requestBody.requests[0];
            assert.deepStrictEqual(request.addDocumentTab.tabProperties, { title: 'My Custom Tab' });
        });
    });
});

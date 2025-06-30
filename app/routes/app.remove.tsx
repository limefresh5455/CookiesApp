import {
  Page,
  Card,
  IndexTable,
  useIndexResourceState,
  Text,
  Box,
  Icon,
  Button,
  Pagination,
  Layout,
  BlockStack,
  InlineStack,
} from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import { DeleteIcon } from '@shopify/polaris-icons';
import { useState } from 'react';

    
    
const ITEMS_PER_PAGE = 10;

const cookiesData = [
  { id: '1', name: '_ga' },
  { id: '2', name: '_gid' },
  { id: '3', name: 'cookieConsent' },
  { id: '4', name: '_fbp' },
  { id: '5', name: '__cfduid' },
  { id: '6', name: 'session_id' },
  { id: '7', name: 'user_token' },
  { id: '8', name: '_ga' },
  { id: '9', name: '_gid' },
  { id: '10', name: 'cookieConsent' },
  { id: '11', name: '_fbp' },
  { id: '12', name: '__cfduid' },
  { id: '13', name: 'session_id' },
  { id: '14', name: 'user_token' },
];

export default function CookieTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedData = cookiesData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resourceName = {
    singular: 'cookie',
    plural: 'cookies',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(paginatedData);

    const handleRemoveSelected = () => {
        console.log('Remove these:', selectedResources);
        // Add logic to actually remove cookies
    };
  return (
    <Page>
      <TitleBar title="Cookies Remove" />
      <Layout>
        <Layout.Section>
          <BlockStack>
            <Card>
                <Box padding="200" minHeight="50px">
                    <InlineStack align="space-between" wrap={false} blockAlign="center">
                        <Text variant="headingSm" as="h6">Total Cookies: {cookiesData.length}</Text>

                        {selectedResources.length > 0 && (
                        <Button tone="critical" onClick={handleRemoveSelected}>
                            {`Remove Selected (${selectedResources.length})`}
                        </Button>
                        )}
                    </InlineStack>
                    </Box>


                <IndexTable
                resourceName={resourceName}
                itemCount={paginatedData.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                        { id: 'checkbox', title: '' },
                        { id: 'number', title: 'No.' },
                        { id: 'cookieName', title: 'Cookie Name' },
                        {
                            id: 'remove',
                            title: (
                            <InlineStack align="center" blockAlign="center">
                                <Text as="span" alignment="center">Remove</Text>
                            </InlineStack>
                            )
                        }
                        ]}
                selectable
                >
                {paginatedData.map((cookie, index) => (
                    <IndexTable.Row
                    id={cookie.id}
                    key={cookie.id}
                    selected={selectedResources.includes(cookie.id)}
                    position={index}
                    >
                    <IndexTable.Cell></IndexTable.Cell>
                    <IndexTable.Cell>
                        <Text as="p">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>{cookie.name}</IndexTable.Cell>
                    <IndexTable.Cell >
                            <Icon source={DeleteIcon} tone="critical" />
                    </IndexTable.Cell>
                    </IndexTable.Row>
                ))}
                </IndexTable>
                <InlineStack align="center" blockAlign="center">
                <Pagination
                    hasPrevious={currentPage > 1}
                    onPrevious={() => setCurrentPage((p) => p - 1)}
                    hasNext={currentPage * ITEMS_PER_PAGE < cookiesData.length}
                    onNext={() => setCurrentPage((p) => p + 1)}
                />
                </InlineStack>
            </Card>

            
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
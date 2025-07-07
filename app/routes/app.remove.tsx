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
  Spinner,
} from '@shopify/polaris';
import { TitleBar } from "@shopify/app-bridge-react";
import { DeleteIcon } from '@shopify/polaris-icons';
import { useState, useEffect } from 'react';

// Define cookie structure
interface Cookie {
  id: string;
  name: string;
  [key: string]: any;
}

const ITEMS_PER_PAGE = 10;

export default function CookieTable() {
  const [cookiesData, setCookiesData] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch cookies from API
  useEffect(() => {
    const fetchCookies = async () => {
      try {
        const response = await fetch('https://cc-platform-api-prod.fly.dev/scannerCookie/scanner/112');
        const data = await response.json();

        const formatted = data.map((cookie: any) => ({
          ...cookie,
          id: cookie.id.toString(),
        }));

        setCookiesData(formatted);
      } catch (error) {
        console.error("Failed to fetch cookies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCookies();
  }, []);

  const paginatedData = cookiesData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resourceName = {
    singular: 'cookie',
    plural: 'cookies',
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(paginatedData as { [key: string]: any }[]);

  // ✅ Bulk remove handler
  const handleRemoveSelected = async () => {
    const selectedCookies = cookiesData.filter(cookie =>
      selectedResources.includes(cookie.id)
    );
    const cookieNames = selectedCookies.map(cookie => cookie.name);

    try {
      const response = await fetch('https://cc-platform-api-prod.fly.dev/banner/remove-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cookieNames }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove cookies');
      }

      console.log('Removed:', cookieNames);

      // Remove from state
      setCookiesData(prev =>
        prev.filter(cookie => !selectedResources.includes(cookie.id))
      );
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
  };

  // ✅ Single cookie delete
  const handleRemoveSingle = async (cookieName: string) => {
    try {
      const response = await fetch('https://cc-platform-api-prod.fly.dev/banner/remove-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cookieNames: [cookieName] }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove cookie');
      }

      console.log(`Removed: ${cookieName}`);

      // Remove from UI
      setCookiesData(prev =>
        prev.filter(cookie => cookie.name !== cookieName)
      );
    } catch (error) {
      console.error('Single delete error:', error);
    }
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
                  <Text variant="headingSm" as="h6">
                    Total Cookies: {cookiesData.length}
                  </Text>
                  {selectedResources.length > 0 && (
                    <Button tone="critical" onClick={handleRemoveSelected}>
                      {`Remove Selected (${selectedResources.length})`}
                    </Button>
                  )}
                </InlineStack>
              </Box>

              {loading ? (
                <Box padding="400" minHeight="100px">
                  <InlineStack align="center" blockAlign="center">
                    <Spinner accessibilityLabel="Loading cookies" size="large" />
                  </InlineStack>
                </Box>
              ) : (
                <>
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
                        <IndexTable.Cell />
                        <IndexTable.Cell>
                          <Text as="p">
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>{cookie.name}</IndexTable.Cell>
                        <IndexTable.Cell>
                          <Box padding="100">
                            <InlineStack align="center" blockAlign="center">
                              <Button 
                                icon={DeleteIcon}
                                tone="critical"
                                variant="plain"
                                onClick={() => handleRemoveSingle(cookie.name)}
                                accessibilityLabel={`Remove ${cookie.name}`}
                              />
                            </InlineStack>
                          </Box>
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
                </>
              )}
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

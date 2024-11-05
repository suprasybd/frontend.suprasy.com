import { useQuery } from '@tanstack/react-query';
import { Category, getAllCategories } from './api';
import { useParams } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { getUserStoresProductsList } from '../products/api';
import { DataTable } from '@/components/Table/table';
import { productsColumnCategories } from './table/columns';
import PaginationMain from '@/components/Pagination/Pagination';
import { activeFilters } from '@/libs/helpers/filters';
import { ChevronRight } from 'lucide-react';

const ProductCategories = () => {
  const { data: categoryResponse } = useQuery({
    queryKey: ['getCategoriesAllCatPage'],
    queryFn: () => getAllCategories(),
  });

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Organize categories into parent and children
  const organizedCategories = useMemo(() => {
    if (!categoryResponse?.Data) return [];

    const parents = categoryResponse.Data.filter(
      (cat) => cat.ParentCategoryId === null
    );

    return parents.map((parent) => ({
      ...parent,
      children: categoryResponse.Data.filter(
        (cat) => cat.ParentCategoryId === parent.Id
      ),
    }));
  }, [categoryResponse?.Data]);

  return (
    <div className="container mx-auto p-4">
      {organizedCategories.length > 0 ? (
        <div className="flex gap-6">
          {/* Categories sidebar */}
          <div className="w-72 shrink-0">
            <div className="bg-card rounded-lg border p-4 space-y-4">
              {organizedCategories.map((parent) => (
                <div key={parent.Id} className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(parent.Id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === parent.Id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {parent.Name}
                  </button>

                  {parent.children.length > 0 && (
                    <div className="ml-4 space-y-1 border-l">
                      {parent.children.map((child) => (
                        <button
                          key={child.Id}
                          onClick={() => setSelectedCategory(child.Id)}
                          className={`w-full text-left pl-4 pr-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                            selectedCategory === child.Id
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <ChevronRight className="h-3 w-3" />
                          {child.Name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Products area */}
          <div className="flex-1">
            {selectedCategory ? (
              <ProductTable
                category={
                  categoryResponse!.Data.find((c) => c.Id === selectedCategory)!
                }
              />
            ) : (
              <div className="text-center py-8 bg-muted/10 rounded-lg">
                <p className="text-muted-foreground">
                  Select a category to view products
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No categories found</p>
        </div>
      )}
    </div>
  );
};

const ProductTable: React.FC<{ category: Category }> = ({ category }) => {
  const { storeKey } = useParams({ strict: false }) as { storeKey: string };

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // { Status: tab, Page: page, Limit: limit }
  const { data: products, isLoading } = useQuery({
    queryKey: ['getUserStoresProductsList', storeKey, page, limit, category.Id],
    queryFn: () =>
      getUserStoresProductsList({
        ...activeFilters([
          { isActive: true, key: 'CategoryId', value: category.Id.toString() },
        ]),
        Status: 'active',
        Page: page,
        Limit: limit,
      }),
    enabled: !!storeKey,
  });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : products?.Data && products.Data.length > 0 ? (
        <>
          <DataTable columns={productsColumnCategories} data={products.Data} />
          {products.Pagination && (
            <div className="mt-4">
              <PaginationMain
                PaginationDetails={products.Pagination}
                setPage={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-muted/10 rounded-lg">
          <p className="text-muted-foreground">
            No products found in this category
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;

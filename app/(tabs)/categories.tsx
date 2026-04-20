import CategoryCard from '@/components/categories/CategoryCard';
import CategoryForm from '@/components/categories/CategoryForm';
import EmptyState from '@/components/ui/EmptyState';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { COLOURS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/db/client';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet } from 'react-native';

type Category = {
  id: number;
  name: string;
  colour: string;
  icon: string;
};

export default function CategoriesScreen() {
  const { user } = useAuth();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    const cats = await db.select().from(categories).where(eq(categories.userId, user.id));
    setCategoryList(cats);
  };

  const handleAdd = async (data: { name: string; colour: string; icon: string }) => {
    await db.insert(categories).values({
      userId: user!.id,
      name: data.name,
      colour: data.colour,
      icon: data.icon,
    });
    setShowForm(false);
    loadData();
  };

  const handleEdit = async (data: { name: string; colour: string; icon: string }) => {
    if (!editingCategory) return;
    await db.update(categories).set({
      name: data.name,
      colour: data.colour,
      icon: data.icon,
    }).where(eq(categories.id, editingCategory.id));
    setEditingCategory(null);
    setShowForm(false);
    loadData();
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Category', 'Are you sure? This may affect habits using this category.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await db.delete(categories).where(eq(categories.id, id));
          loadData();
        }
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <ScreenHeader title="Categories" subtitle={`${categoryList.length} categories`} />
      {!showForm && (
        <PrimaryButton
          title="+ Add Category"
          onPress={() => { setEditingCategory(null); setShowForm(true); }}
        />
      )}
      {showForm && (
        <CategoryForm
          initialName={editingCategory?.name}
          initialColour={editingCategory?.colour}
          initialIcon={editingCategory?.icon}
          onSubmit={editingCategory ? handleEdit : handleAdd}
          submitLabel={editingCategory ? 'Update Category' : 'Add Category'}
        />
      )}
      {categoryList.length === 0 && !showForm ? (
        <EmptyState title="No categories yet" message="Tap + Add Category to get started" />
      ) : (
        <FlatList
          data={categoryList}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <CategoryCard
              name={item.name}
              colour={item.colour}
              icon={item.icon}
              onEdit={() => { setEditingCategory(item); setShowForm(true); }}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLOURS.background },
});
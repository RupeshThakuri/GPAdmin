import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useWatch, useForm, type Control, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { Product } from "@/types";
import { useGetCategoriesQuery } from "@/services/category";
import { Category } from "@/types";
import { useGetUnitsQuery } from "@/services/unit";
import { Unit } from "@/types";
import { useGetTaxesQuery } from "@/services/tax";
import { Tax } from "@/types";
import { useGetBrandsQuery } from "@/services/brand";
import { Brand } from "@/types";
import { useGetCurrenciesQuery } from "@/services/currency";
import { Currency } from "@/types";
import { useGetProductQuery } from "@/services/product";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";

interface ProductFormValues extends Omit<Product, "id" | "createdAt" | "updatedAt"> { }

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  defaultValues?: ProductFormValues;
  isUpdate?: boolean;
}

const schema = yup.object({
  name: yup.string().required("Name is required"),
  categoryId: yup.string().required("Category is required"),
  unitId: yup.string().required("Unit is required"),
  brandId: yup.string().required("Brand is required"),
  taxId: yup.string().required("Tax is required"),
  currencyId: yup.string().required("Currency is required"),
  price: yup.number().required("Price is required").positive("Price must be positive"),
  cost: yup.number().required("Cost is required").positive("Cost must be positive"),
  stock: yup.number().required("Stock is required").integer("Stock must be an integer").min(0, "Stock must be at least 0"),
  sku: yup.string().required("SKU is required"),
  description: yup.string().optional(),
});

function ProductForm({ onSubmit, defaultValues, isUpdate = false }: ProductFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const { data: categories, isLoading: isLoadingCategories, error: errorCategories } = useGetCategoriesQuery({});
  const { data: units, isLoading: isLoadingUnits, error: errorUnits } = useGetUnitsQuery({});
  const { data: taxes, isLoading: isLoadingTaxes, error: errorTaxes } = useGetTaxesQuery({});
  const { data: brands, isLoading: isLoadingBrands, error: errorBrands } = useGetBrandsQuery({});
  const { data: currencies, isLoading: isLoadingCurrencies, error: errorCurrencies } = useGetCurrenciesQuery({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      categoryId: "",
      unitId: "",
      brandId: "",
      taxId: "",
      currencyId: "",
      price: 0,
      cost: 0,
      stock: 0,
      sku: "",
      description: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const categoryOptions = categories?.data.map((category: Category) => ({
    value: category.id,
    label: category.name,
  })) || [];

  const unitOptions = units?.data.map((unit: Unit) => ({
    value: unit.id,
    label: unit.name,
  })) || [];

  const taxOptions = taxes?.data.map((tax: Tax) => ({
    value: tax.id,
    label: tax.name,
  })) || [];

  const brandOptions = brands?.data.map((brand: Brand) => ({
    value: brand.id,
    label: brand.name,
  })) || [];

  const currencyOptions = currencies?.data.map((currency: Currency) => ({
    value: currency.id,
    label: currency.name,
  })) || [];

  const selectedCategory = useWatch({
    control,
    name: "categoryId",
  });

  const selectedUnit = useWatch({
    control,
    name: "unitId",
  });

  const selectedTax = useWatch({
    control,
    name: "taxId",
  });

  const selectedBrand = useWatch({
    control,
    name: "brandId",
  });

  const selectedCurrency = useWatch({
    control,
    name: "currencyId",
  });

  const isLoading = isLoadingCategories || isLoadingUnits || isLoadingTaxes || isLoadingBrands || isLoadingCurrencies;
  const hasError = errorCategories || errorUnits || errorTaxes || errorBrands || errorCurrencies;

  useEffect(() => {
    if (hasError) {
      enqueueSnackbar(t("Something went wrong"), { variant: "error" });
      router.push("/products");
    }
  }, [hasError, router, t]);

  if (isLoading) {
    return <Typography>{t("Loading...")}</Typography>;
  }

  if (hasError) {
    return <Typography>{t("Something went wrong")}</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Box maxWidth={800} margin="0 auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t("Product Information")}
                </Typography>
                <Divider />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("Name")}
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoryId}>
                  <InputLabel id="category-label">{t("Category")}</InputLabel>
                  <Select
                    labelId="category-label"
                    label={t("Category")}
                    {...register("categoryId")}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <FormHelperText>{errors.categoryId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.unitId}>
                  <InputLabel id="unit-label">{t("Unit")}</InputLabel>
                  <Select labelId="unit-label" label={t("Unit")} {...register("unitId")}>
                    {unitOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.unitId && <FormHelperText>{errors.unitId.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.brandId}>
                  <InputLabel id="brand-label">{t("Brand")}</InputLabel>
                  <Select labelId="brand-label" label={t("Brand")} {...register("brandId")}>
                    {brandOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.brandId && <FormHelperText>{errors.brandId.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.taxId}>
                  <InputLabel id="tax-label">{t("Tax")}</InputLabel>
                  <Select labelId="tax-label" label={t("Tax")} {...register("taxId")}>
                    {taxOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.taxId && <FormHelperText>{errors.taxId.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.currencyId}>
                  <InputLabel id="currency-label">{t("Currency")}</InputLabel>
                  <Select
                    labelId="currency-label"
                    label={t("Currency")}
                    {...register("currencyId")}
                  >
                    {currencyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.currencyId && (
                    <FormHelperText>{errors.currencyId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("Price")}
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("Cost")}
                  type="number"
                  {...register("cost", { valueAsNumber: true })}
                  error={!!errors.cost}
                  helperText={errors.cost?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("Stock")}
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("SKU")}
                  {...register("sku")}
                  error={!!errors.sku}
                  helperText={errors.sku?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("Description")}
                  multiline
                  rows={4}
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="end" spacing={2}>
                  <Button variant="outlined" color="secondary">
                    {t("Cancel")}
                  </Button>
                  <Button variant="contained" type="submit">
                    {isUpdate ? t("Update Product") : t("Create Product")}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductForm;
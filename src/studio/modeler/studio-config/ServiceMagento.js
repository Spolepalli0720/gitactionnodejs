// valid values for type: UserTask, DataObject, DataStore, ServiceTask
module.exports.REST_MAGENTO = {
    label_tag: 'Group',
    label_path: 'Endpoint',
    label_method: 'Operation',
    tags: [
        {
          paths: [
            { name: "Store Views", value: "/{SELECTED_VERSION}/store/storeViews", methods: ["GET"] },
            { name: "Store Groups", value: "/{SELECTED_VERSION}/store/storeGroups", methods: ["GET"] },
            { name: "Websites", value: "/{SELECTED_VERSION}/store/websites", methods: ["GET"] },
            { name: "Store Configs", value: "/{SELECTED_VERSION}/store/storeConfigs", methods: ["GET"] }
          ],
          value: "storeRepository", name: "Store Repository"
        },
        {
          paths: [
            { name: "Currency Information", value: "/{SELECTED_VERSION}/directory/currency", methods: ["GET"] },
            { name: "Countries Information", value: "/{SELECTED_VERSION}/directory/countries", methods: ["GET"] },
            { name: "Countries Information by Id", value: "/{SELECTED_VERSION}/directory/countries/{countryId}", methods: ["GET"] }
          ],
          value: "directoryRepository", name: "Directory Repository"
        },
        {
          paths: [
            { name: "AttributeSet List", value: "/{SELECTED_VERSION}/eav/attribute-sets/list", methods: ["GET"] },
            { name: "AttributeSet Management", value: "/{SELECTED_VERSION}/eav/attribute-sets", methods: ["POST"]  },
            { name: "AttributeSet by Id", value: "/{SELECTED_VERSION}/eav/attribute-sets/{attributeSetId}", methods: ["GET", "DELETE", "PUT"] }
          ],
          value: "eavAttributeSetRepository", name: "AttributeSet Repository"
        },
        {
          paths: [
            { name: "CustomerGroups Management", value: "/{SELECTED_VERSION}/customerGroups", methods: ["POST"] },
            { name: "CustomerGroups Search", value: "/{SELECTED_VERSION}/customerGroups/search", methods: ["GET"] },
            { ame: "CustomerGroups By id", value: "/{SELECTED_VERSION}/customerGroups/{id}", methods: ["GET", "DELETE", "PUT"] }
          ],
          value: "customerGroupRepository", name: "Customer Group Repository"
        },
        {
          paths: [
            { name: "Default", value: "/{SELECTED_VERSION}/customerGroups/default", methods: ["GET"] },
            { name: "Default by storeId", value: "/{SELECTED_VERSION}/customerGroups/default/{storeId}", methods: ["GET"] },
            { name: "Group permissions", value: "/{SELECTED_VERSION}/customerGroups/{id}/permissions", methods: ["GET"] },
            { name: "Group Config Default by id", value: "/{SELECTED_VERSION}/customerGroups/default/{id}", methods: ["PUT"] }
          ],
          value: "customerGroupManagement", name: "Customer Group Management"
        },
        {
          paths: [
            { name: "Customer custom", value: "/{SELECTED_VERSION}/attributeMetadata/customer/custom", methods: ["GET"] },
            { name: "Customer form by formCode", value: "/{SELECTED_VERSION}/attributeMetadata/customer/form/{formCode}", methods: ["GET"] },
            { name: "Customer", value: "/{SELECTED_VERSION}/attributeMetadata/customer", methods: ["GET"] },
            { name: "Customer attribute by attributeCode", value: "/{SELECTED_VERSION}/attributeMetadata/customer/attribute/{attributeCode}", methods: ["GET"] }
          ],
          value: "customerCustomerMetadata", name: "Customer Metadata"
        },
        {
          paths: [
            { name: "CustomerAddress form by formCode", value: "/{SELECTED_VERSION}/attributeMetadata/customerAddress/form/{formCode}", methods: ["GET"] },
            { name: "CustomerAddress custom", value: "/{SELECTED_VERSION}/attributeMetadata/customerAddress/custom", methods: ["GET"] },
            { name: "CustomerAddress", value: "/{SELECTED_VERSION}/attributeMetadata/customerAddress", methods: ["GET"] },
            { name: "CustomerAddress attribute by attributeCode", value: "/{SELECTED_VERSION}/attributeMetadata/customerAddress/attribute/{attributeCode}", methods: ["GET"] }
          ],
          value: "customerAddressMetadata", name: "Customer Address Metadata"
        },
        {
          paths: [
            { name: "Search", value: "/{SELECTED_VERSION}/customers/search", methods: ["GET"] },
            { name: "Search By customerId", value: "/{SELECTED_VERSION}/customers/{customerId}", methods: ["GET", "DELETE", "PUT"] },
            { name: "Me", value: "/{SELECTED_VERSION}/customers/me", methods: ["GET", "PUT"] }
          ],
          value: "customerCustomerRepository", name: "Customer Repository"
        },
        {
          paths: [
            { name: "By customerId permissions readonly", value: "/{SELECTED_VERSION}/customers/{customerId}/permissions/readonly", methods: ["GET"] },
            { name: "Password", value: "/{SELECTED_VERSION}/customers/password", methods: ["PUT"] },
            { name: "By customerId confirm", value: "/{SELECTED_VERSION}/customers/{customerId}/confirm", methods: ["GET"] },
            { name: "Me billingAddress", value: "/{SELECTED_VERSION}/customers/me/billingAddress", methods: ["GET"] },
            { name: "Validate", value: "/{SELECTED_VERSION}/customers/validate", methods: ["PUT"] },
            { name: "customers", value: "/{SELECTED_VERSION}/customers", methods: ["POST"] },
            { name: "By email activate", value: "/{SELECTED_VERSION}/customers/{email}/activate", methods: ["PUT"] },
            { name: "Me password", value: "/{SELECTED_VERSION}/customers/me/password", methods: ["PUT"] },
            { name: "Me shippingAddress", value: "/{SELECTED_VERSION}/customers/me/shippingAddress", methods: ["GET"] },
            { name: "By customerId billingAddress", value: "/{SELECTED_VERSION}/customers/{customerId}/billingAddress", methods: ["GET"] },
            { name: "Confirm", value: "/{SELECTED_VERSION}/customers/confirm", methods: ["POST"] },
            { name: "ResetPassword", value: "/{SELECTED_VERSION}/customers/resetPassword", methods: ["POST"] },
            { name: "Me activate", value: "/{SELECTED_VERSION}/customers/me/activate", methods: ["PUT"] },
            { name: "By customerId password resetLinkToken by resetPasswordLinkToken", value: "/{SELECTED_VERSION}/customers/{customerId}/password/resetLinkToken/{resetPasswordLinkToken}", methods: ["GET"] },
            { name: "By customerId shippingAddress", value: "/{SELECTED_VERSION}/customers/{customerId}/shippingAddress", methods: ["GET"] },
            { name: "IsEmailAvailable", value: "/{SELECTED_VERSION}/customers/isEmailAvailable", methods: ["POST"] }
          ],
          value: "customerAccountManagement", name: "Customer Account Management"
        },
        {
          paths: [
            { name: "By addressId", value: "/{SELECTED_VERSION}/addresses/{addressId}", methods: ["DELETE"] },
            { name: "Addresses by addressId", value: "/{SELECTED_VERSION}/customers/addresses/{addressId}", methods: ["GET"] }
          ],
          value: "customerAddressRepository", name: "Customer Address Repository"
        },
        {
          paths: [
            { name: "modules", value: "/{SELECTED_VERSION}/modules", methods: ["GET"] }
          ],
          value: "backendModuleService", name: "Backend Module Service"
        },
        {
          paths: [
            { name: "By pageId", value: "/{SELECTED_VERSION}/cmsPage/{pageId}", methods: ["GET", "DELETE"] },
            { name: "cmsPage", value: "/{SELECTED_VERSION}/cmsPage", methods: ["POST"] },
            { name: "By id", value: "/{SELECTED_VERSION}/cmsPage/{id}", methods: ["PUT"] },
            { name: "Search", value: "/{SELECTED_VERSION}/cmsPage/search", methods: ["GET"] }
          ],
          value: "cmsPageRepository", name: "CMS Page Repository"
        },
        {
          paths: [
            { name: "By blockId", value: "/{SELECTED_VERSION}/cmsBlock/{blockId}", methods: ["GET", "DELETE"] },
            { name: "cmsBlock", value: "/{SELECTED_VERSION}/cmsBlock", methods: ["POST"] },
            { name: "By id", value: "/{SELECTED_VERSION}/cmsBlock/{id}", methods: ["PUT"] },
            { name: "Search", value: "/{SELECTED_VERSION}/cmsBlock/search", methods: ["GET"] }
          ],
          value: "cmsBlockRepository", name: "CMS Block Repository"
        },
        {
          paths: [
            { name: "By sku", value: "/{SELECTED_VERSION}/products/{sku}", methods: ["GET", "DELETE", "PUT"] },
            { name: "products", value: "/{SELECTED_VERSION}/products", methods: ["POST", "GET"] }
          ],
          value: "catalogProductRepository", name: "Catalog Product Repository"
        },
        {
          paths: [
            { name: "Attributes types", value: "/{SELECTED_VERSION}/products/attributes/types", methods: ["GET"] }
          ],
          value: "catalogProductAttributeTypesList", name: "Catalog Product Attribute Types List"
        },
        {
          paths: [
            { name: "Attributes by attributeCode", value: "/{SELECTED_VERSION}/products/attributes/{attributeCode}", methods: ["GET", "DELETE", "PUT"] },
            { name: "Attributes", value: "/{SELECTED_VERSION}/products/attributes", methods: ["POST", "GET"] }
          ],
          value: "catalogProductAttributeRepository", name: "Catalog Product Attribute Repository"
        },
        {
          paths: [
            { name: "Attributes by attributeCode", value: "/{SELECTED_VERSION}/categories/attributes/{attributeCode}", methods: ["GET"] },
            { name: "Attributes", value: "/{SELECTED_VERSION}/categories/attributes", methods: ["GET"] }
          ],
          value: "catalogCategoryAttributeRepository", name: "Catalog Category Attribute Repository"
        },
        {
          paths: [
            { name: "Attributes by attributeCode options", value: "/{SELECTED_VERSION}/categories/attributes/{attributeCode}/options", methods: ["GET"] }
          ],
          value: "catalogCategoryAttributeOptionManagement", name: "Catalog Category Attribute Option Management"
        },
        {
          paths: [
            { name: "Types", value: "/{SELECTED_VERSION}/products/types", methods: ["GET"] }
          ],
          value: "catalogProductTypeList", name: "Catalog Product Type List"
        },
        {
          paths: [
            { name: "Attribute-sets by attributeSetId", value: "/{SELECTED_VERSION}/products/attribute-sets/{attributeSetId}", methods: ["GET", "DELETE", "PUT"] },
            { name: "Attribute-sets sets list", value: "/{SELECTED_VERSION}/products/attribute-sets/sets/list", methods: ["GET"] }
          ],
          value: "catalogAttributeSetRepository", name: "Catalog AttributeSet Repository"
        },
        {
          paths: [
            { name: "Attribute-sets", value: "/{SELECTED_VERSION}/products/attribute-sets", methods: ["POST"] }
          ],
          value: "catalogAttributeSetManagement", name: "Catalog AttributeSet Management"
        },
        {
          paths: [
            { name: "Attribute-sets attributes", value: "/{SELECTED_VERSION}/products/attribute-sets/attributes", methods: ["POST"] },
            { name: "Attribute-sets by attributeSetId attributes", value: "/{SELECTED_VERSION}/products/attribute-sets/{attributeSetId}/attributes", methods: ["GET"] },
            { name: "Attribute-sets by attributeSetId attributes by attributeCode", value: "/{SELECTED_VERSION}/products/attribute-sets/{attributeSetId}/attributes/{attributeCode}", methods: ["DELETE"] }
          ],
          value: "catalogProductAttributeManagement", name: "Catalog Product Attribute Management"
        },
        {
          paths: [
            { name: "Attribute-sets groups list", value: "/{SELECTED_VERSION}/products/attribute-sets/groups/list", methods: ["GET"] },
            { name: "Attribute-sets groups", value: "/{SELECTED_VERSION}/products/attribute-sets/groups", methods: ["POST"] },
            { name: "Attribute-sets by attributeSetId groups", value: "/{SELECTED_VERSION}/products/attribute-sets/{attributeSetId}/groups", methods: ["PUT"] },
            { name: "Attribute-sets groups by groupId", value: "/{SELECTED_VERSION}/products/attribute-sets/groups/{groupId}", methods: ["DELETE"] }
          ],
          value: "catalogProductAttributeGroupRepository", name: "Catalog Product Attribute Group Repository"
        },
        {
          paths: [
            { name: "Attributes by attributeCode options", value: "/{SELECTED_VERSION}/products/attributes/{attributeCode}/options", methods: ["POST", "GET"] },
            { name: "Attributes by attributeCode options by optionId", value: "/{SELECTED_VERSION}/products/attributes/{attributeCode}/options/{optionId}", methods: ["DELETE"] }
          ],
          value: "catalogProductAttributeOptionManagement", name: "Catalog Product Attribute Option Management"
        },
        {
          paths: [
            { name: "Media types by attributeSetName", value: "/{SELECTED_VERSION}/products/media/types/{attributeSetName}", methods: ["GET"] }
          ],
          value: "catalogProductMediaAttributeManagement", name: "Catalog Product Media Attribute Management"
        },
        {
          paths: [
            { name: "By sku media", value: "/{SELECTED_VERSION}/products/{sku}/media", methods: ["POST", "GET"] },
            { name: "By sku media by entryId", value: "/{SELECTED_VERSION}/products/{sku}/media/{entryId}", methods: ["GET", "DELETE", "PUT"] }
          ],
          value: "catalogProductAttributeMediaGalleryManagement", name: "Catalog Product Attribute Media Gallery Management"
        },
        {
          paths: [
            { name: "By sku group-prices by customerGroupId tiers by qty price by price", value: "/{SELECTED_VERSION}/products/{sku}/group-prices/{customerGroupId}/tiers/{qty}/price/{price}", methods: ["POST"] },
            { name: "By sku group-prices by customerGroupId tiers by qty", value: "/{SELECTED_VERSION}/products/{sku}/group-prices/{customerGroupId}/tiers/{qty}", methods: ["DELETE"] },
            { name: "By sku group-prices by customerGroupId tiers", value: "/{SELECTED_VERSION}/products/{sku}/group-prices/{customerGroupId}/tiers", methods: ["GET"] }
          ],
          value: "catalogProductTierPriceManagement", name: "Catalog Product Tier Price Management"
        },
        {
          paths: [
            { name: "Tier-prices", value: "/{SELECTED_VERSION}/products/tier-prices", methods: ["POST", "PUT"] },
            { name: "Tier-prices-delete", value: "/{SELECTED_VERSION}/products/tier-prices-delete", methods: ["POST"] },
            { name: "Tier-prices-information", value: "/{SELECTED_VERSION}/products/tier-prices-information", methods: ["POST"] }
          ],
          value: "catalogTierPriceStorage", name: "Catalog Tier Price Storage"
        },
        {
          paths: [
            { name: "Base-prices-information", value: "/{SELECTED_VERSION}/products/base-prices-information", methods: ["POST"] },
            { name: "Base-prices", value: "/{SELECTED_VERSION}/products/base-prices", methods: ["POST"] }
          ],
          value: "catalogBasePriceStorage", name: "Catalog Base Price Storage"
        },
        {
          paths: [
            { name: "Cost-delete", value: "/{SELECTED_VERSION}/products/cost-delete", methods: ["POST"] },
            { name: "Cost", value: "/{SELECTED_VERSION}/products/cost", methods: ["POST"] },
            { name: "Cost-information", value: "/{SELECTED_VERSION}/products/cost-information", methods: ["POST"] }
          ],
          value: "catalogCostStorage", name: "Catalog Cost Storage"
        },
        {
          paths: [
            { name: "Special-price-information", value: "/{SELECTED_VERSION}/products/special-price-information", methods: ["POST"] },
            { name: "Special-price", value: "/{SELECTED_VERSION}/products/special-price", methods: ["POST"] },
            { name: "Special-price-delete", value: "/{SELECTED_VERSION}/products/special-price-delete", methods: ["POST"] }
          ],
          value: "catalogSpecialPriceStorage", name: "Catalog Special Price Storage"
        },
        {
          paths: [
            { name: "Categories", value: "/{SELECTED_VERSION}/categories", methods: ["POST"] },
            { name: "By categoryId", value: "/{SELECTED_VERSION}/categories/{categoryId}", methods: ["GET", "DELETE"] },
            { name: "By id", value: "/{SELECTED_VERSION}/categories/{id}", methods: ["PUT"] }
          ],
          value: "catalogCategoryRepository", name: "Catalog Category Repository"
        },
        {
          paths: [
            { name: "Categories", value: "/{SELECTED_VERSION}/categories", methods: ["GET"] },
            { name: "By categoryId move", value: "/{SELECTED_VERSION}/categories/{categoryId}/move", methods: ["PUT"] }
          ],
          value: "catalogCategoryManagement", name: "Catalog Category Management"
        },
        {
          paths: [
            { name: "List", value: "/{SELECTED_VERSION}/categories/list", methods: ["GET"] }
          ],
          value: "catalogCategoryList", name: "Catalog Category List"
        },
        {
          paths: [
            { name: "Options types", value: "/{SELECTED_VERSION}/products/options/types", methods: ["GET"] }
          ],
          value: "catalogProductCustomOptionTypeList", name: "Catalog Product Custom Option Type List"
        },
        {
          paths: [
            { name: "Options by optionId", value: "/{SELECTED_VERSION}/products/options/{optionId}", methods: ["PUT"] },
            { name: "Options", value: "/{SELECTED_VERSION}/products/options", methods: ["POST"] },
            { name: "By sku options by optionId", value: "/{SELECTED_VERSION}/products/{sku}/options/{optionId}", methods: ["GET", "DELETE"] },
            { name: "By sku options", value: "/{SELECTED_VERSION}/products/{sku}/options", methods: ["GET"] }
          ],
          value: "catalogProductCustomOptionRepository", name: "Catalog Product Custom Option Repository"
        },
        {
          paths: [
            { name: "Links by type attributes", value: "/{SELECTED_VERSION}/products/links/{type}/attributes", methods: ["GET"] },
            { name: "Links types", value: "/{SELECTED_VERSION}/products/links/types", methods: ["GET"] }
          ],
          value: "catalogProductLinkTypeList", name: "Catalog Product Link Type List"
        },
        {
          paths: [
            { name: "By sku links by type", value: "/{SELECTED_VERSION}/products/{sku}/links/{type}", methods: ["GET"] },
            { name: "By sku links", value: "/{SELECTED_VERSION}/products/{sku}/links", methods: ["POST"] }
          ],
          value: "catalogProductLinkManagement", name: "Catalog Product Link Management"
        },
        {
          paths: [
            { name: "By sku links by type by linkedProductSku", value: "/{SELECTED_VERSION}/products/{sku}/links/{type}/{linkedProductSku}", methods: ["DELETE"] },
            { name: "By sku links", value: "/{SELECTED_VERSION}/products/{sku}/links", methods: ["PUT"] }
          ],
          value: "catalogProductLinkRepository", name: "Catalog Product Link Repository"
        },
        {
          paths: [
            { name: "By categoryId products", value: "/{SELECTED_VERSION}/categories/{categoryId}/products", methods: ["GET"] }
          ],
          value: "catalogCategoryLinkManagement", name: "Catalog Category Link Management"
        },
        {
          paths: [
            { name: "By categoryId products", value: "/{SELECTED_VERSION}/categories/{categoryId}/products", methods: ["POST", "PUT"] },
            { name: "By categoryId products by sku", value: "/{SELECTED_VERSION}/categories/{categoryId}/products/{sku}", methods: ["DELETE"] }
          ],
          value: "catalogCategoryLinkRepository", name: "Catalog Category Link Repository"
        },
        {
          paths: [
            { name: "By sku websites by websiteId", value: "/{SELECTED_VERSION}/products/{sku}/websites/{websiteId}", methods: ["DELETE"] },
            { name: "By sku websites", value: "/{SELECTED_VERSION}/products/{sku}/websites", methods: ["POST", "PUT"] }
          ],
          value: "catalogProductWebsiteLinkRepository", name: "Catalog Product Website Link Repository"
        },
        {
          paths: [
            { name: "Products render info", value: "/{SELECTED_VERSION}/products-render-info", methods: ["GET"] }
          ],
          value: "catalogProductRenderList", name: "Catalog Product Render List"
        },
        {
          paths: [
            { name: "Mine", value: "/{SELECTED_VERSION}/carts/mine", methods: ["PUT"] },
            { name: "By cartId", value: "/{SELECTED_VERSION}/carts/{cartId}", methods: ["GET"] },
            { name: "Search", value: "/{SELECTED_VERSION}/carts/search", methods: ["GET"] }
          ],
          value: "quoteCartRepository", name: "Quote Cart Repository"
        },
        {
          paths: [
            { name: "By customerId carts", value: "/{SELECTED_VERSION}/customers/{customerId}/carts", methods: ["POST"] },
            { name: "carts", value: "/{SELECTED_VERSION}/carts/", methods: ["POST"] },
            { name: "Mine", value: "/{SELECTED_VERSION}/carts/mine", methods: ["POST", "GET"] },
            { name: "By cartId", value: "/{SELECTED_VERSION}/carts/{cartId}", methods: ["PUT"] },
            { name: "By cartId order", value: "/{SELECTED_VERSION}/carts/{cartId}/order", methods: ["PUT"] },
            { name: "Mine order", value: "/{SELECTED_VERSION}/carts/mine/order", methods: ["PUT"] }
          ],
          value: "quoteCartManagement", name: "Quote Cart Management"
        },
        {
          paths: [
            { name: "By cartId", value: "/{SELECTED_VERSION}/guest-carts/{cartId}", methods: ["GET"] }
          ],
          value: "quoteGuestCartRepository", name: "Quote Guest Cart Repository"
        },
        {
          paths: [
            { name: "By cartId", value: "/{SELECTED_VERSION}/guest-carts/{cartId}", methods: ["PUT"] },
            { name: "Guest Carts", value: "/{SELECTED_VERSION}/guest-carts", methods: ["POST"] },
            { name: "By cartId order", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/order", methods: ["PUT"] }
          ],
          value: "quoteGuestCartManagement", name: "Quote Guest Cart Management"
        },
        {
          paths: [
            { name: "Mine shipping-methods", value: "/{SELECTED_VERSION}/carts/mine/shipping-methods", methods: ["GET"] },
            { name: "By cartId shipping-methods", value: "/{SELECTED_VERSION}/carts/{cartId}/shipping-methods", methods: ["GET"] },
            { name: "By cartId estimate-shipping-methods-by-address-id", value: "/{SELECTED_VERSION}/carts/{cartId}/estimate-shipping-methods-by-address-id", methods: ["POST"] },
            { name: "Mine estimate-shipping-methods-by-address-id", value: "/{SELECTED_VERSION}/carts/mine/estimate-shipping-methods-by-address-id", methods: ["POST"] }
          ],
          value: "quoteShippingMethodManagement", name: "Quote Shipping Method Management"
        },
        {
          paths: [
            { name: "Mine estimate-shipping-methods", value: "/{SELECTED_VERSION}/carts/mine/estimate-shipping-methods", methods: ["POST"] },
            { name: "By cartId estimate-shipping-methods", value: "/{SELECTED_VERSION}/carts/{cartId}/estimate-shipping-methods", methods: ["POST"] }
          ],
          value: "quoteShipmentEstimation", name: "Quote Shipment Estimation"
        },
        {
          paths: [
            { name: "By cartId shipping-methods", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/shipping-methods", methods: ["GET"] }
          ],
          value: "quoteGuestShippingMethodManagement", name: "Quote Guest Shipping Method Management"
        },
        {
          paths: [
            { name: "By cartId estimate-shipping-methods", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/estimate-shipping-methods", methods: ["POST"] }
          ],
          value: "quoteGuestShipmentEstimation", name: "Interface GuestShipmentEstimationInterface"
        },
        {
          paths: [
            { name: "By quoteId items", value: "/{SELECTED_VERSION}/carts/{quoteId}/items", methods: ["POST"] },
            { name: "Mine items", value: "/{SELECTED_VERSION}/carts/mine/items", methods: ["POST", "GET"] },
            { name: "By cartId items by itemId", value: "/{SELECTED_VERSION}/carts/{cartId}/items/{itemId}", methods: ["DELETE", "PUT"] },
            { name: "By cartId items", value: "/{SELECTED_VERSION}/carts/{cartId}/items", methods: ["GET"] },
            { name: "Mine items by itemId", value: "/{SELECTED_VERSION}/carts/mine/items/{itemId}", methods: ["DELETE", "PUT"] }
          ],
          value: "quoteCartItemRepository", name: "Quote Cart Item Repository"
        },
        {
          paths: [
            { name: "By cartId items", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/items", methods: ["POST", "GET"] },
            { name: "By cartId items by itemId", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/items/{itemId}", methods: ["DELETE", "PUT"] }
          ],
          value: "quoteGuestCartItemRepository", name: "Quote Guest Cart Item Repository"
        },
        {
          paths: [
            { name: "By cartId payment-methods", value: "/{SELECTED_VERSION}/carts/{cartId}/payment-methods", methods: ["GET"] },
            { name: "Mine selected-payment-method", value: "/{SELECTED_VERSION}/carts/mine/selected-payment-method", methods: ["GET", "PUT"] },
            { name: "Mine payment-methods", value: "/{SELECTED_VERSION}/carts/mine/payment-methods", methods: ["GET"] },
            { name: "By cartId selected-payment-method", value: "/{SELECTED_VERSION}/carts/{cartId}/selected-payment-method", methods: ["GET", "PUT"] }
          ],
          value: "quotePaymentMethodManagement", name: "Quote Payment Method Management"
        },
        {
          paths: [
            { name: "By cartId selected-payment-method", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/selected-payment-method", methods: ["GET", "PUT"] },
            { name: "By cartId payment-methods", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/payment-methods", methods: ["GET"] }
          ],
          value: "quoteGuestPaymentMethodManagement", name: "Quote Guest Payment Method Management"
        },
        {
          paths: [
            { name: "Mine billing-address", value: "/{SELECTED_VERSION}/carts/mine/billing-address", methods: ["POST", "GET"] },
            { name: "By cartId billing-address", value: "/{SELECTED_VERSION}/carts/{cartId}/billing-address", methods: ["POST", "GET"] }
          ],
          value: "quoteBillingAddressManagement", name: "Quote Billing Address Management"
        },
        {
          paths: [
            { name: "By cartId billing-address", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/billing-address", methods: ["POST", "GET"] }
          ],
          value: "quoteGuestBillingAddressManagement", name: "Quote Guest Billing Address Management"
        },
        {
          paths: [
            { name: "Mine coupons by couponCode", value: "/{SELECTED_VERSION}/carts/mine/coupons/{couponCode}", methods: ["PUT"] },
            { name: "By cartId coupons", value: "/{SELECTED_VERSION}/carts/{cartId}/coupons", methods: ["GET", "DELETE"] },
            { name: "By cartId coupons by couponCode", value: "/{SELECTED_VERSION}/carts/{cartId}/coupons/{couponCode}", methods: ["PUT"] },
            { name: "Mine coupons", value: "/{SELECTED_VERSION}/carts/mine/coupons", methods: ["GET", "DELETE"] }
          ],
          value: "quoteCouponManagement", name: "Quote Coupon Management"
        },
        {
          paths: [
            { name: "By cartId coupons", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/coupons", methods: ["GET", "DELETE"] },
            { name: "By cartId coupons by couponCode", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/coupons/{couponCode}", methods: ["PUT"] }
          ],
          value: "quoteGuestCouponManagement", name: "Quote Guest Coupon Management"
        },
        {
          paths: [
            { name: "Mine totals", value: "/{SELECTED_VERSION}/carts/mine/totals", methods: ["GET"] },
            { name: "By cartId totals", value: "/{SELECTED_VERSION}/carts/{cartId}/totals", methods: ["GET"] }
          ],
          value: "quoteCartTotalRepository", name: "Quote Cart Total Repository"
        },
        {
          paths: [
            { name: "By cartId collect-totals", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/collect-totals", methods: ["PUT"] }
          ],
          value: "quoteGuestCartTotalManagement", name: "Quote Guest Cart Total Management"
        },
        {
          paths: [
            { name: "By cartId totals", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/totals", methods: ["GET"] }
          ],
          value: "quoteGuestCartTotalRepository", name: "Quote Guest Cart Total Repository"
        },
        {
          paths: [
            { name: "Mine collect-totals", value: "/{SELECTED_VERSION}/carts/mine/collect-totals", methods: ["PUT"] }
          ],
          value: "quoteCartTotalManagement", name: "Quote Cart Total Management"
        },
        {
          paths: [
            { name: "By sku options by optionId children by childSku", value: "/{SELECTED_VERSION}/bundle-products/{sku}/options/{optionId}/children/{childSku}", methods: ["DELETE"] },
            { name: "By productSku children", value: "/{SELECTED_VERSION}/bundle-products/{productSku}/children", methods: ["GET"] },
            { name: "By sku links by optionId", value: "/{SELECTED_VERSION}/bundle-products/{sku}/links/{optionId}", methods: ["POST"] },
            { name: "By sku links by id", value: "/{SELECTED_VERSION}/bundle-products/{sku}/links/{id}", methods: ["PUT"] }
          ],
          value: "bundleProductLinkManagement", name: "Bundle Product Link Management"
        },
        {
          paths: [
            { name: "By sku options all", value: "/{SELECTED_VERSION}/bundle-products/{sku}/options/all", methods: ["GET"] },
            { name: "By sku options by optionId", value: "/{SELECTED_VERSION}/bundle-products/{sku}/options/{optionId}", methods: ["GET", "DELETE"] }
          ],
          value: "bundleProductOptionRepository", name: "Bundle Product Option Repository"
        },
        {
          paths: [
            { name: "Options types", value: "/{SELECTED_VERSION}/bundle-products/options/types", methods: ["GET"] }
          ],
          value: "bundleProductOptionTypeList", name: "Bundle Product Option Type List"
        },
        {
          paths: [
            { name: "Options by optionId", value: "/{SELECTED_VERSION}/bundle-products/options/{optionId}", methods: ["PUT"] },
            { name: "Options add", value: "/{SELECTED_VERSION}/bundle-products/options/add", methods: ["POST"] }
          ],
          value: "bundleProductOptionManagement", name: "Bundle Product Option Management"
        },
        {
          paths: [
            { name: "Requisition Lists", value: "/{SELECTED_VERSION}/requisition_lists", methods: ["POST"] }
          ],
          value: "requisitionListRequisitionListRepository", name: "Requisition List Requisition List Repository"
        },
        {
          paths: [
            { name: "Search", value: "/{SELECTED_VERSION}/search", methods: ["GET"] }
          ],
          value: "search", name: "Search API for all requests"
        },
        {
          paths: [
            { name: "By productSku", value: "/{SELECTED_VERSION}/stockStatuses/{productSku}", methods: ["GET"] },
            { name: "By productSku stockItems by itemId", value: "/{SELECTED_VERSION}/products/{productSku}/stockItems/{itemId}", methods: ["PUT"] },
            { name: "LowStock", value: "/{SELECTED_VERSION}/stockItems/lowStock/", methods: ["GET"] },
            { name: "By productSku", value: "/{SELECTED_VERSION}/stockItems/{productSku}", methods: ["GET"] }
          ],
          value: "catalogInventoryStockRegistry", name: "Catalog Inventory Stock Registry"
        },
        {
          paths: [
            { name: "Create", value: "/{SELECTED_VERSION}/orders/create", methods: ["PUT"] },
            { name: "Orders", value: "/{SELECTED_VERSION}/orders", methods: ["GET"] },
            { name: "By id", value: "/{SELECTED_VERSION}/orders/{id}", methods: ["GET"] },
            { name: "Create orders", value: "/{SELECTED_VERSION}/orders/", methods: ["POST"] }
          ],
          value: "salesOrderRepository", name: "Sales Order Repository"
        },
        {
          paths: [
            { name: "By id statuses", value: "/{SELECTED_VERSION}/orders/{id}/statuses", methods: ["GET"] },
            { name: "By id comments", value: "/{SELECTED_VERSION}/orders/{id}/comments", methods: ["POST", "GET"] },
            { name: "By id emails", value: "/{SELECTED_VERSION}/orders/{id}/emails", methods: ["POST"] },
            { name: "By id unhold", value: "/{SELECTED_VERSION}/orders/{id}/unhold", methods: ["POST"] },
            { name: "By id cancel", value: "/{SELECTED_VERSION}/orders/{id}/cancel", methods: ["POST"] },
            { name: "By id hold", value: "/{SELECTED_VERSION}/orders/{id}/hold", methods: ["POST"] }
          ],
          value: "salesOrderManagement", name: "Sales Order Management"
        },
        {
          paths: [
            { name: "By parent_id", value: "/{SELECTED_VERSION}/orders/{parent_id}", methods: ["PUT"] }
          ],
          value: "salesOrderAddressRepository", name: "Sales Order Address Repository"
        },
        {
          paths: [
            { name: "Items by id", value: "/{SELECTED_VERSION}/orders/items/{id}", methods: ["GET"] },
            { name: "Items", value: "/{SELECTED_VERSION}/orders/items", methods: ["GET"] }
          ],
          value: "salesOrderItemRepository", name: "Sales Order Item Repository"
        },
        {
          paths: [
            { name: "create invoices", value: "/{SELECTED_VERSION}/invoices/", methods: ["POST"] },
            { name: "invoices", value: "/{SELECTED_VERSION}/invoices", methods: ["GET"] },
            { name: "By id", value: "/{SELECTED_VERSION}/invoices/{id}", methods: ["GET"] }
          ],
          value: "salesInvoiceRepository", name: "Sales Invoice Repository"
        },
        {
          paths: [
            { name: "By id capture", value: "/{SELECTED_VERSION}/invoices/{id}/capture", methods: ["POST"] },
            { name: "By id comments", value: "/{SELECTED_VERSION}/invoices/{id}/comments", methods: ["GET"] },
            { name: "By id emails", value: "/{SELECTED_VERSION}/invoices/{id}/emails", methods: ["POST"] },
            { name: "By id void", value: "/{SELECTED_VERSION}/invoices/{id}/void", methods: ["POST"] }
          ],
          value: "salesInvoiceManagement", name: "Sales Invoice Management"
        },
        {
          paths: [
            { name: "Comments", value: "/{SELECTED_VERSION}/invoices/comments", methods: ["POST"] }
          ],
          value: "salesInvoiceCommentRepository", name: "Sales Invoice Comment Repository"
        },
        {
          paths: [
            { name: "By invoiceId refund", value: "/{SELECTED_VERSION}/invoice/{invoiceId}/refund", methods: ["POST"] }
          ],
          value: "salesRefundInvoice", name: "Sales Refund Invoice"
        },
        {
          paths: [
            { name: "By id emails", value: "/{SELECTED_VERSION}/creditmemo/{id}/emails", methods: ["POST"] },
            { name: "Refund", value: "/{SELECTED_VERSION}/creditmemo/refund", methods: ["POST"] },
            { name: "By id comments", value: "/{SELECTED_VERSION}/creditmemo/{id}/comments", methods: ["GET"] },
            { name: "By id", value: "/{SELECTED_VERSION}/creditmemo/{id}", methods: ["PUT"] }
          ],
          value: "salesCreditmemoManagement", name: "Sales Credit Memo Management"
        },
        {
          paths: [
            { name: "creditmemos", value: "/{SELECTED_VERSION}/creditmemos", methods: ["GET"] },
            { name: "create creditmemo", value: "/{SELECTED_VERSION}/creditmemo", methods: ["POST"] },
            { name: "By id", value: "/{SELECTED_VERSION}/creditmemo/{id}", methods: ["GET"] }
          ],
          value: "salesCreditmemoRepository", name: "Sales Credit Memo Repository"
        },
        {
          paths: [
            { name: "By id comments", value: "/{SELECTED_VERSION}/creditmemo/{id}/comments", methods: ["POST"] }
          ],
          value: "salesCreditmemoCommentRepository", name: "Credit memo comment repository interface"
        },
        {
          paths: [
            { name: "By orderId refund", value: "/{SELECTED_VERSION}/order/{orderId}/refund", methods: ["POST"] }
          ],
          value: "salesRefundOrder", name: "Sales Refund Order"
        },
        {
          paths: [
            { name: "shipments", value: "/{SELECTED_VERSION}/shipments", methods: ["GET"] },
            { name: "create shipment", value: "/{SELECTED_VERSION}/shipment/", methods: ["POST"] },
            { name: "By id", value: "/{SELECTED_VERSION}/shipment/{id}", methods: ["GET"] }
          ],
          value: "salesShipmentRepository", name: "Sales Shipment Repository"
        },
        {
          paths: [
            { name: "By id label", value: "/{SELECTED_VERSION}/shipment/{id}/label", methods: ["GET"] },
            { name: "By id emails", value: "/{SELECTED_VERSION}/shipment/{id}/emails", methods: ["POST"] },
            { name: "By id comments", value: "/{SELECTED_VERSION}/shipment/{id}/comments", methods: ["GET"] }
          ],
          value: "salesShipmentManagement", name: "Sales Shipment Management"
        },
        {
          paths: [
            { name: "By id comments", value: "/{SELECTED_VERSION}/shipment/{id}/comments", methods: ["POST"] }
          ],
          value: "salesShipmentCommentRepository", name: "Sales Shipment Comment Repository"
        },
        {
          paths: [
            { name: "Track by id", value: "/{SELECTED_VERSION}/shipment/track/{id}", methods: ["DELETE"] },
            { name: "Track", value: "/{SELECTED_VERSION}/shipment/track", methods: ["POST"] }
          ],
          value: "salesShipmentTrackRepository", name: "Sales Shipment Track Repository"
        },
        {
          paths: [
            { name: "By orderId ship", value: "/{SELECTED_VERSION}/order/{orderId}/ship", methods: ["POST"] }
          ],
          value: "salesShipOrder", name: "Sales Ship Order"
        },
        {
          paths: [
            { name: "By id", value: "/{SELECTED_VERSION}/transactions/{id}", methods: ["GET"] },
            { name: "transactions", value: "/{SELECTED_VERSION}/transactions", methods: ["GET"] }
          ],
          value: "salesTransactionRepository", name: "Sales Transaction Repository"
        },
        {
          paths: [
            { name: "By orderId invoice", value: "/{SELECTED_VERSION}/order/{orderId}/invoice", methods: ["POST"] }
          ],
          value: "salesInvoiceOrder", name: "Sales Invoice Order"
        },
        {
          paths: [
            { name: "By cartId shipping-information", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/shipping-information", methods: ["POST"] }
          ],
          value: "checkoutGuestShippingInformationManagement", name: "Checkout Guest Shipping Information Management"
        },
        {
          paths: [
            { name: "By cartId shipping-information", value: "/{SELECTED_VERSION}/carts/{cartId}/shipping-information", methods: ["POST"] },
            { name: "Mine shipping-information", value: "/{SELECTED_VERSION}/carts/mine/shipping-information", methods: ["POST"] }
          ],
          value: "checkoutShippingInformationManagement", name: "Checkout Shipping Information Management"
        },
        {
          paths: [
            { name: "By cartId totals-information", value: "/{SELECTED_VERSION}/carts/{cartId}/totals-information", methods: ["POST"] },
            { name: "Mine totals-information", value: "/{SELECTED_VERSION}/carts/mine/totals-information", methods: ["POST"] }
          ],
          value: "checkoutTotalsInformationManagement", name: "Checkout Totals Information Management"
        },
        {
          paths: [
            { name: "By cartId totals-information", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/totals-information", methods: ["POST"] }
          ],
          value: "checkoutGuestTotalsInformationManagement", name: "Checkout Guest Totals Information Management"
        },
        {
          paths: [
            { name: "By cartId payment-information", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/payment-information", methods: ["POST", "GET"] },
            { name: "By cartId set-payment-information", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/set-payment-information", methods: ["POST"] }
          ],
          value: "checkoutGuestPaymentInformationManagement", name: "Checkout Guest Payment Information Management"
        },
        {
          paths: [
            { name: "Mine payment-information", value: "/{SELECTED_VERSION}/carts/mine/payment-information", methods: ["POST", "GET"] },
            { name: "Mine set-payment-information", value: "/{SELECTED_VERSION}/carts/mine/set-payment-information", methods: ["POST"] }
          ],
          value: "checkoutPaymentInformationManagement", name: "Checkout Payment Information Management"
        },
        {
          paths: [
            { name: "Search", value: "/{SELECTED_VERSION}/salesRules/search", methods: ["GET"] },
            { name: "By ruleId", value: "/{SELECTED_VERSION}/salesRules/{ruleId}", methods: ["GET", "DELETE", "PUT"] },
            { name: "salesRules", value: "/{SELECTED_VERSION}/salesRules", methods: ["POST"] }
          ],
          value: "salesRuleRuleRepository", name: "Sales Rule Rule Repository"
        },
        {
          paths: [
            { name: "coupons", value: "/{SELECTED_VERSION}/coupons", methods: ["POST"] },
            { name: "Search", value: "/{SELECTED_VERSION}/coupons/search", methods: ["GET"] },
            { name: "By couponId", value: "/{SELECTED_VERSION}/coupons/{couponId}", methods: ["GET", "DELETE", "PUT"] }
          ],
          value: "salesRuleCouponRepository", name: "Sales Rule Coupon Repository"
        },
        {
          paths: [
            { name: "DeleteByIds", value: "/{SELECTED_VERSION}/coupons/deleteByIds", methods: ["POST"] },
            { name: "Generate", value: "/{SELECTED_VERSION}/coupons/generate", methods: ["POST"] },
            { name: "DeleteByCodes", value: "/{SELECTED_VERSION}/coupons/deleteByCodes", methods: ["POST"] }
          ],
          value: "salesRuleCouponManagement", name: "Sales Rule Coupon Management"
        },
        {
          paths: [
            { name: "By sku child", value: "/{SELECTED_VERSION}/configurable-products/{sku}/child", methods: ["POST"] },
            { name: "By sku children", value: "/{SELECTED_VERSION}/configurable-products/{sku}/children", methods: ["GET"] },
            { name: "By sku children by childSku", value: "/{SELECTED_VERSION}/configurable-products/{sku}/children/{childSku}", methods: ["DELETE"] }
          ],
          value: "configurableProductLinkManagement", name: "Configurable Product Link Management"
        },
        {
          paths: [
            { name: "Variation", value: "/{SELECTED_VERSION}/configurable-products/variation", methods: ["PUT"] }
          ],
          value: "configurableProductConfigurableProductManagement", name: "Configurable Product Configurable Product Management"
        },
        {
          paths: [
            { name: "By sku options by id", value: "/{SELECTED_VERSION}/configurable-products/{sku}/options/{id}", methods: ["GET", "DELETE", "PUT"] },
            { name: "By sku options", value: "/{SELECTED_VERSION}/configurable-products/{sku}/options", methods: ["POST"] },
            { name: "By sku options all", value: "/{SELECTED_VERSION}/configurable-products/{sku}/options/all", methods: ["GET"] }
          ],
          value: "configurableProductOptionRepository", name: "Configurable Product Option Repository"
        },
        {
          paths: [
            { name: "By sku downloadable-links", value: "/{SELECTED_VERSION}/products/{sku}/downloadable-links", methods: ["POST", "GET"] },
            { name: "Downloadable-links by id", value: "/{SELECTED_VERSION}/products/downloadable-links/{id}", methods: ["DELETE"] },
            { name: "By sku downloadable-links by id", value: "/{SELECTED_VERSION}/products/{sku}/downloadable-links/{id}", methods: ["PUT"] }
          ],
          value: "downloadableLinkRepository", name: "Downloadable Link Repository"
        },
        {
          paths: [
            { name: "By sku downloadable-links samples by id", value: "/{SELECTED_VERSION}/products/{sku}/downloadable-links/samples/{id}", methods: ["PUT"] },
            { name: "By sku downloadable-links samples", value: "/{SELECTED_VERSION}/products/{sku}/downloadable-links/samples", methods: ["POST", "GET"] },
            { name: "Downloadable-links samples by id", value: "/{SELECTED_VERSION}/products/downloadable-links/samples/{id}", methods: ["DELETE"] }
          ],
          value: "downloadableSampleRepository", name: "Downloadable Sample Repository"
        },
        {
          paths: [
            { name: "Licence", value: "/{SELECTED_VERSION}/carts/licence", methods: ["GET"] }
          ],
          value: "checkoutAgreementsCheckoutAgreementsRepository", name: "Checkout Agreements Checkout Agreements Repository"
        },
        {
          paths: [
            { name: "Search", value: "/{SELECTED_VERSION}/taxRates/search", methods: ["GET"] },
            { name: "By rateId", value: "/{SELECTED_VERSION}/taxRates/{rateId}", methods: ["GET", "DELETE"] },
            { name: "taxRates", value: "/{SELECTED_VERSION}/taxRates", methods: ["POST", "PUT"] }
          ],
          value: "taxTaxRateRepository", name: "Tax Tax Rate Repository"
        },
        {
          paths: [
            { name: "By ruleId", value: "/{SELECTED_VERSION}/taxRules/{ruleId}", methods: ["GET", "DELETE"] },
            { name: "taxRules", value: "/{SELECTED_VERSION}/taxRules", methods: ["POST", "PUT"] },
            { name: "Search", value: "/{SELECTED_VERSION}/taxRules/search", methods: ["GET"] }
          ],
          value: "taxTaxRuleRepository", name: "Tax Tax Rule Repository"
        },
        {
          paths: [
            { name: "By classId", value: "/{SELECTED_VERSION}/taxClasses/{classId}", methods: ["PUT"] },
            { name: "Search", value: "/{SELECTED_VERSION}/taxClasses/search", methods: ["GET"] },
            { name: "By taxClassId", value: "/{SELECTED_VERSION}/taxClasses/{taxClassId}", methods: ["GET", "DELETE"] },
            { name: "taxClasses", value: "/{SELECTED_VERSION}/taxClasses", methods: ["POST"] }
          ],
          value: "taxTaxClassRepository", name: "Tax Tax Class Repository"
        },
        {
          paths: [
            { name: "By companyId", value: "/{SELECTED_VERSION}/company/{companyId}", methods: ["GET", "DELETE", "PUT"] },
            { name: "Company", value: "/{SELECTED_VERSION}/company/", methods: ["POST", "GET"] }
          ],
          value: "companyCompanyRepository", name: "Company Company Repository"
        },
        {
          paths: [
            { name: "By teamId", value: "/{SELECTED_VERSION}/team/{teamId}", methods: ["GET", "DELETE", "PUT"] },
            { name: "Team", value: "/{SELECTED_VERSION}/team/", methods: ["GET"] },
            { name: "By companyId", value: "/{SELECTED_VERSION}/team/{companyId}", methods: ["POST"] }
          ],
          value: "companyTeamRepository", name: "Company Team Repository"
        },
        {
          paths: [
            { name: "Move by id", value: "/{SELECTED_VERSION}/hierarchy/move/{id}", methods: ["PUT"] },
            { name: "By id", value: "/{SELECTED_VERSION}/hierarchy/{id}", methods: ["GET"] }
          ],
          value: "companyCompanyHierarchy", name: "Company Company Hierarchy"
        },
        {
          paths: [
            { name: "Role by id", value: "/{SELECTED_VERSION}/company/role/{id}", methods: ["PUT"] },
            { name: "Role", value: "/{SELECTED_VERSION}/company/role/", methods: ["POST", "GET"] },
            { name: "Role by roleId", value: "/{SELECTED_VERSION}/company/role/{roleId}", methods: ["GET", "DELETE"] }
          ],
          value: "companyRoleRepository", name: "Company Role Repository"
        },
        {
          paths: [
            { name: "Role by roleId users", value: "/{SELECTED_VERSION}/company/role/{roleId}/users", methods: ["GET"] },
            { name: "AssignRoles", value: "/{SELECTED_VERSION}/company/assignRoles", methods: ["PUT"] }
          ],
          value: "companyAcl", name: "Company Access Control List"
        },
        {
          paths: [
            { name: "Admin token", value: "/{SELECTED_VERSION}/integration/admin/token", methods: ["POST"] }
          ],
          value: "integrationAdminTokenService", name: "Integration Admin Token Service"
        },
        {
          paths: [
            { name: "Customer token", value: "/{SELECTED_VERSION}/integration/customer/token", methods: ["POST"] }
          ],
          value: "integrationCustomerTokenService", name: "Integration Customer Token Service"
        },
        {
          paths: [
            { name: "Link", value: "/{SELECTED_VERSION}/analytics/link", methods: ["GET"] }
          ],
          value: "analyticsLinkProvider", name: "Analytics Link Provider"
        },
        {
          paths: [
            { name: "Mine balance apply", value: "/{SELECTED_VERSION}/carts/mine/balance/apply", methods: ["POST"] },
            { name: "Mine balance unapply", value: "/{SELECTED_VERSION}/carts/mine/balance/unapply", methods: ["POST"] }
          ],
          value: "customerBalanceBalanceManagementFromQuote", name: "Customer Balance Balance Management From Quote"
        },
        {
          paths: [
            { name: "SubmitToCustomer", value: "/{SELECTED_VERSION}/negotiableQuote/submitToCustomer", methods: ["POST"] },
            { name: "Decline", value: "/{SELECTED_VERSION}/negotiableQuote/decline", methods: ["POST"] },
            { name: "Request", value: "/{SELECTED_VERSION}/negotiableQuote/request", methods: ["POST"] }
          ],
          value: "negotiableQuoteNegotiableQuoteManagement", name: "Negotiable Quote Negotiable Quote Management"
        },
        {
          paths: [
            { name: "PricesUpdated", value: "/{SELECTED_VERSION}/negotiableQuote/pricesUpdated", methods: ["POST"] }
          ],
          value: "negotiableQuoteNegotiableQuotePriceManagement", name: "Negotiable Quote Negotiable Quote Price Management"
        },
        {
          paths: [
            { name: "AttachmentContent", value: "/{SELECTED_VERSION}/negotiableQuote/attachmentContent", methods: ["GET"] }
          ],
          value: "negotiableQuoteAttachmentContentManagement", name: "Negotiable Quote Attachment Content Management"
        },
        {
          paths: [
            { name: "By quoteId comments", value: "/{SELECTED_VERSION}/negotiableQuote/{quoteId}/comments", methods: ["GET"] }
          ],
          value: "negotiableQuoteCommentLocator", name: "Negotiable Quote Comment Locator"
        },
        {
          paths: [
            { name: "By quoteId shippingMethod", value: "/{SELECTED_VERSION}/negotiableQuote/{quoteId}/shippingMethod", methods: ["PUT"] }
          ],
          value: "negotiableQuoteNegotiableQuoteShippingManagement", name: "Negotiable Quote Negotiable Quote Shipping Management"
        },
        {
          paths: [
            { name: "By cartId set-payment-information", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/set-payment-information", methods: ["POST"] },
            { name: "By cartId payment-information", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/payment-information", methods: ["POST", "GET"] }
          ],
          value: "negotiableQuotePaymentInformationManagement", name: "Negotiable Quote Payment Information Management"
        },
        {
          paths: [
            { name: "By cartId shipping-information", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/shipping-information", methods: ["POST"] }
          ],
          value: "negotiableQuoteShippingInformationManagement", name: "Negotiable Quote Shipping Information Management"
        },
        {
          paths: [
            { name: "By cartId estimate-shipping-methods", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/estimate-shipping-methods", methods: ["POST"] }
          ],
          value: "negotiableQuoteShipmentEstimation", name: "Negotiable Quote Shipment Estimation"
        },
        {
          paths: [
            { name: "By cartId estimate-shipping-methods-by-address-id", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/estimate-shipping-methods-by-address-id", methods: ["POST"] }
          ],
          value: "negotiableQuoteShippingMethodManagement", name: "Negotiable Quote Shipping Method Management"
        },
        {
          paths: [
            { name: "By quoteId", value: "/{SELECTED_VERSION}/negotiableQuote/{quoteId}", methods: ["PUT"] }
          ],
          value: "negotiableQuoteNegotiableCartRepository", name: "Negotiable Quote Negotiable Cart Repository"
        },
        {
          paths: [
            { name: "By cartId billing-address", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/billing-address", methods: ["POST", "GET"] }
          ],
          value: "negotiableQuoteBillingAddressManagement", name: "Negotiable Quote Billing Address Management"
        },
        {
          paths: [
            { name: "By cartId totals", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/totals", methods: ["GET"] }
          ],
          value: "negotiableQuoteCartTotalRepository", name: "Negotiable Quote Cart Total Repository"
        },
        {
          paths: [
            { name: "By cartId coupons by couponCode", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/coupons/{couponCode}", methods: ["PUT"] },
            { name: "By cartId coupons", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/coupons", methods: ["DELETE"] }
          ],
          value: "negotiableQuoteCouponManagement", name: "Negotiable Quote Coupon Management"
        },
        {
          paths: [
            { name: "By cartId giftCards", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/giftCards", methods: ["POST"] },
            { name: "By cartId giftCards by giftCardCode", value: "/{SELECTED_VERSION}/negotiable-carts/{cartId}/giftCards/{giftCardCode}", methods: ["DELETE"] }
          ],
          value: "negotiableQuoteGiftCardAccountManagement", name: "Negotiable Quote Gift Card Account Management"
        },
        {
          paths: [
            { name: "By quoteId giftCards", value: "/{SELECTED_VERSION}/carts/{quoteId}/giftCards", methods: ["GET"] },
            { name: "Mine giftCards", value: "/{SELECTED_VERSION}/carts/mine/giftCards", methods: ["POST"] },
            { name: "By cartId giftCards by giftCardCode", value: "/{SELECTED_VERSION}/carts/{cartId}/giftCards/{giftCardCode}", methods: ["DELETE"] },
            { name: "By cartId giftCards", value: "/{SELECTED_VERSION}/carts/{cartId}/giftCards", methods: ["PUT"] },
            { name: "Mine checkGiftCard by giftCardCode", value: "/{SELECTED_VERSION}/carts/mine/checkGiftCard/{giftCardCode}", methods: ["GET"] },
            { name: "Mine giftCards by giftCardCode", value: "/{SELECTED_VERSION}/carts/mine/giftCards/{giftCardCode}", methods: ["DELETE"] }
          ],
          value: "giftCardAccountGiftCardAccountManagement", name: "giftCardAccount Gift Card Account Management"
        },
        {
          paths: [
            { name: "Guest-carts by cartId giftCards by giftCardCode", value: "/{SELECTED_VERSION}/carts/guest-carts/{cartId}/giftCards/{giftCardCode}", methods: ["DELETE"] },
            { name: "Guest-carts by cartId giftCards", value: "/{SELECTED_VERSION}/carts/guest-carts/{cartId}/giftCards", methods: ["POST"] },
            { name: "Guest-carts by cartId checkGiftCard by giftCardCode", value: "/{SELECTED_VERSION}/carts/guest-carts/{cartId}/checkGiftCard/{giftCardCode}", methods: ["GET"] }
          ],
          value: "giftCardAccountGuestGiftCardAccountManagement", name: "giftCardAccount Guest Gift Card Account Management"
        },
        {
          paths: [
            { name: "sharedCatalog", value: "/{SELECTED_VERSION}/sharedCatalog/", methods: ["GET"] },
            { name: "create sharedCatalog", value: "/{SELECTED_VERSION}/sharedCatalog", methods: ["POST"] },
            { name: "By sharedCatalogId", value: "/{SELECTED_VERSION}/sharedCatalog/{sharedCatalogId}", methods: ["GET", "DELETE"] },
            { name: "By id", value: "/{SELECTED_VERSION}/sharedCatalog/{id}", methods: ["PUT"] }
          ],
          value: "sharedCatalogSharedCatalogRepository", name: "sharedCatalog Shared Catalog Repository"
        },
        {
          paths: [
            { name: "By sharedCatalogId assignCompanies", value: "/{SELECTED_VERSION}/sharedCatalog/{sharedCatalogId}/assignCompanies", methods: ["POST"] },
            { name: "By sharedCatalogId unassignCompanies", value: "/{SELECTED_VERSION}/sharedCatalog/{sharedCatalogId}/unassignCompanies", methods: ["POST"] },
            { name: "By sharedCatalogId companies", value: "/{SELECTED_VERSION}/sharedCatalog/{sharedCatalogId}/companies", methods: ["GET"] }
          ],
          value: "sharedCatalogCompanyManagement", name: "sharedCatalog Company Management"
        },
        {
          paths: [
            { name: "By id assignProducts", value: "/{SELECTED_VERSION}/sharedCatalog/{id}/assignProducts", methods: ["POST"] },
            { name: "By id products", value: "/{SELECTED_VERSION}/sharedCatalog/{id}/products", methods: ["GET"] },
            { name: "By id unassignProducts", value: "/{SELECTED_VERSION}/sharedCatalog/{id}/unassignProducts", methods: ["POST"] }
          ],
          value: "sharedCatalogProductManagement", name: "sharedCatalog Product Management"
        },
        {
          paths: [
            { name: "By id categories", value: "/{SELECTED_VERSION}/sharedCatalog/{id}/categories", methods: ["GET"] },
            { name: "By id unassignCategories", value: "/{SELECTED_VERSION}/sharedCatalog/{id}/unassignCategories", methods: ["POST"] },
            { name: "By id assignCategories", value: "/{SELECTED_VERSION}/sharedCatalog/{id}/assignCategories", methods: ["POST"] }
          ],
          value: "sharedCatalogCategoryManagement", name: "sharedCatalog Category Management"
        },
        {
          paths: [
            { name: "Mine gift-message", value: "/{SELECTED_VERSION}/carts/mine/gift-message", methods: ["POST", "GET"] },
            { name: "By cartId gift-message", value: "/{SELECTED_VERSION}/carts/{cartId}/gift-message", methods: ["POST", "GET"] }
          ],
          value: "giftMessageCartRepository", name: "giftMessage Cart Repository"
        },
        {
          paths: [
            { name: "By cartId gift-message by itemId", value: "/{SELECTED_VERSION}/carts/{cartId}/gift-message/{itemId}", methods: ["POST", "GET"] },
            { name: "Mine gift-message by itemId", value: "/{SELECTED_VERSION}/carts/mine/gift-message/{itemId}", methods: ["POST", "GET"] }
          ],
          value: "giftMessageItemRepository", name: "giftMessage Item Repository"
        },
        {
          paths: [
            { name: "By cartId gift-message", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/gift-message", methods: ["POST", "GET"] }
          ],
          value: "giftMessageGuestCartRepository", name: "giftMessage Guest Cart Repository"
        },
        {
          paths: [
            { name: "By cartId gift-message by itemId", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/gift-message/{itemId}", methods: ["POST", "GET"] }
          ],
          value: "giftMessageGuestItemRepository", name: "giftMessage Guest Item Repository"
        },
        {
          paths: [
            { name: "Mine estimate-shipping-methods", value: "/{SELECTED_VERSION}/giftregistry/mine/estimate-shipping-methods", methods: ["POST"] }
          ],
          value: "giftRegistryShippingMethodManagement", name: "giftRegistry Shipping Method Management"
        },
        {
          paths: [
            { name: "By cartId estimate-shipping-methods", value: "/{SELECTED_VERSION}/guest-giftregistry/{cartId}/estimate-shipping-methods", methods: ["POST"] }
          ],
          value: "giftRegistryGuestCartShippingMethodManagement", name: "giftRegistry Guest Cart Shipping Method Management"
        },
        {
          paths: [
            { name: "giftWrapping", value: "/{SELECTED_VERSION}/gift-wrappings", methods: ["POST", "GET"] },
            { name: "By wrappingId", value: "/{SELECTED_VERSION}/gift-wrappings/{wrappingId}", methods: ["PUT"] },
            { name: "By id", value: "/{SELECTED_VERSION}/gift-wrappings/{id}", methods: ["GET", "DELETE"] }
          ],
          value: "giftWrappingWrappingRepository", name: "giftWrapping Wrapping Repository"
        },
        {
          paths: [
            { name: "Mine use-reward", value: "/{SELECTED_VERSION}/reward/mine/use-reward", methods: ["POST"] }
          ],
          value: "rewardRewardManagement", name: "reward Reward Management"
        },
        {
          paths: [
            { name: "By id labels", value: "/{SELECTED_VERSION}/returns/{id}/labels", methods: ["GET"] },
            { name: "By id tracking-numbers by trackId", value: "/{SELECTED_VERSION}/returns/{id}/tracking-numbers/{trackId}", methods: ["DELETE"] },
            { name: "By id tracking-numbers", value: "/{SELECTED_VERSION}/returns/{id}/tracking-numbers", methods: ["POST", "GET"] }
          ],
          value: "rmaTrackManagement", name: "rma Track Management"
        },
        {
          paths: [
            { name: "By id", value: "/{SELECTED_VERSION}/returns/{id}", methods: ["GET", "DELETE"] }
          ],
          value: "rmaRmaRepository", name: "rma Rma Repository"
        },
        {
          paths: [
            { name: "By id comments", value: "/{SELECTED_VERSION}/returns/{id}/comments", methods: ["POST", "GET"] }
          ],
          value: "rmaCommentManagement", name: "rma Comment Management"
        },
        {
          paths: [
            { name: "returns", value: "/{SELECTED_VERSION}/returns", methods: ["POST", "GET"] },
            { name: "By id", value: "/{SELECTED_VERSION}/returns/{id}", methods: ["PUT"] }
          ],
          value: "rmaRmaManagement", name: "rma Rma Management"
        },
        {
          paths: [
            { name: "By attributeCode", value: "/{SELECTED_VERSION}/returnsAttributeMetadata/{attributeCode}", methods: ["GET"] },
            { name: "Custom", value: "/{SELECTED_VERSION}/returnsAttributeMetadata/custom", methods: ["GET"] },
            { name: "Form by formCode", value: "/{SELECTED_VERSION}/returnsAttributeMetadata/form/{formCode}", methods: ["GET"] },
            { name: "returnsAttributeMetadata", value: "/{SELECTED_VERSION}/returnsAttributeMetadata", methods: ["GET"] }
          ],
          value: "rmaRmaAttributesManagement", name: "rma Rma Attributes Management"
        },
        {
          paths: [
            { name: "By id", value: "/{SELECTED_VERSION}/companyCredits/{id}", methods: ["PUT"] },
            { name: "companyCredits", value: "/{SELECTED_VERSION}/companyCredits/", methods: ["GET"] },
            { name: "By creditId", value: "/{SELECTED_VERSION}/companyCredits/{creditId}", methods: ["GET"] }
          ],
          value: "companyCreditCreditLimitRepository", name: "companyCredit Credit Limit Repository"
        },
        {
          paths: [
            { name: "Company by companyId", value: "/{SELECTED_VERSION}/companyCredits/company/{companyId}", methods: ["GET"] }
          ],
          value: "companyCreditCreditLimitManagement", name: "companyCredit Credit Limit Management"
        },
        {
          paths: [
            { name: "By creditId decreaseBalance", value: "/{SELECTED_VERSION}/companyCredits/{creditId}/decreaseBalance", methods: ["POST"] },
            { name: "By creditId increaseBalance", value: "/{SELECTED_VERSION}/companyCredits/{creditId}/increaseBalance", methods: ["POST"] }
          ],
          value: "companyCreditCreditBalanceManagement", name: "companyCredit Credit Balance Management"
        },
        {
          paths: [
            { name: "History", value: "/{SELECTED_VERSION}/companyCredits/history", methods: ["GET"] },
            { name: "History by historyId", value: "/{SELECTED_VERSION}/companyCredits/history/{historyId}", methods: ["PUT"] }
          ],
          value: "companyCreditCreditHistoryManagement", name: "companyCredit Credit History Management"
        },
        {
          paths: [
            { name: "By bulkUuid detailed-status", value: "/{SELECTED_VERSION}/bulk/{bulkUuid}/detailed-status", methods: ["GET"] },
            { name: "By bulkUuid operation-status by status", value: "/{SELECTED_VERSION}/bulk/{bulkUuid}/operation-status/{status}", methods: ["GET"] },
            { name: "By bulkUuid status", value: "/{SELECTED_VERSION}/bulk/{bulkUuid}/status", methods: ["GET"] }
          ],
          value: "asynchronousOperationsBulkStatus", name: "asynchronous Operations Bulk Status"
        },
        {
          paths: [
            { name: "By cartId payment-information", value: "/{SELECTED_VERSION}/worldpay-guest-carts/{cartId}/payment-information", methods: ["POST"] }
          ],
          value: "worldpayGuestPaymentInformationManagementProxy", name: "worldpay Guest Payment Information Management Proxy"
        },
        {
          paths: [
            { name: "By amazonOrderReferenceId", value: "/{SELECTED_VERSION}/amazon-shipping-address/{amazonOrderReferenceId}", methods: ["PUT"] },
            { name: "By amazonOrderReferenceId", value: "/{SELECTED_VERSION}/amazon-billing-address/{amazonOrderReferenceId}", methods: ["PUT"] }
          ],
          value: "amazonPaymentAddressManagement", name: "amazon Payment Address Management"
        },
        {
          paths: [
            { name: "Order-ref", value: "/{SELECTED_VERSION}/amazon/order-ref", methods: ["DELETE"] }
          ],
          value: "amazonPaymentOrderInformationManagement", name: "amazon Payment Order Information Management"
        },
        {
          paths: [
            { name: "Mine delivery-option", value: "/{SELECTED_VERSION}/carts/mine/delivery-option", methods: ["POST"] }
          ],
          value: "temandoShippingQuoteCartDeliveryOptionManagement", name: "temandoShippingQuote Cart Delivery Option Management"
        },
        {
          paths: [
            { name: "By cartId delivery-option", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/delivery-option", methods: ["POST"] }
          ],
          value: "temandoShippingQuoteGuestCartDeliveryOptionManagement", name: "temandoShippingQuote Guest Cart Delivery Option Management"
        },
        {
          paths: [
            { name: "Rma by rmaId shipments", value: "/{SELECTED_VERSION}/temando/rma/{rmaId}/shipments", methods: ["PUT"] }
          ],
          value: "temandoShippingRmaRmaShipmentManagement", name: "temandoShippingRma Rma Shipment Management"
        },
        {
          paths: [
            { name: "By cartId collection-point select", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/collection-point/select", methods: ["POST"] },
            { name: "By cartId collection-point search-result", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/collection-point/search-result", methods: ["GET"] },
            { name: "By cartId collection-point search-request", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/collection-point/search-request", methods: ["DELETE", "PUT"] }
          ],
          value: "temandoShippingCollectionPointGuestCartCollectionPointManagement", name: "temandoShippingCollectionPoint Guest Cart Collection Point Management"
        },
        {
          paths: [
            { name: "Mine collection-point search-request", value: "/{SELECTED_VERSION}/carts/mine/collection-point/search-request", methods: ["DELETE", "PUT"] },
            { name: "Mine collection-point search-result", value: "/{SELECTED_VERSION}/carts/mine/collection-point/search-result", methods: ["GET"] },
            { name: "Mine collection-point select", value: "/{SELECTED_VERSION}/carts/mine/collection-point/select", methods: ["POST"] }
          ],
          value: "temandoShippingCollectionPointCartCollectionPointManagement", name: "temandoShippingCollectionPoint Cart Collection Point Management"
        },
        {
          paths: [
            { name: "By cartId checkout-fields", value: "/{SELECTED_VERSION}/guest-carts/{cartId}/checkout-fields", methods: ["POST"] }
          ],
          value: "temandoShippingQuoteGuestCartCheckoutFieldManagement", name: "temandoShippingQuote Guest Cart Checkout Field Management"
        },
        {
          paths: [
            { name: "Mine checkout-fields", value: "/{SELECTED_VERSION}/carts/mine/checkout-fields", methods: ["POST"] }
          ],
          value: "temandoShippingQuoteCartCheckoutFieldManagement", name: "temandoShippingQuote Cart Checkout Field Management"
        }
    ],
    versions: [
      "V1"
    ]
};

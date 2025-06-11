# Run this in your tms-masterfilmon directory
# Creates complete folder structure for TMS

# Create main app directories
mkdir -p app/\(auth\)/login
mkdir -p app/\(auth\)/register
mkdir -p app/\(dashboard\)/properties
mkdir -p app/\(dashboard\)/tenants
mkdir -p app/\(dashboard\)/invoices/\[id\]
mkdir -p app/\(dashboard\)/invoices/generate
mkdir -p app/\(dashboard\)/reports
mkdir -p app/\(dashboard\)/settings
mkdir -p app/api/invoices
mkdir -p app/api/email
mkdir -p app/api/pdf

# Create component directories
mkdir -p components/invoice
mkdir -p components/layout
mkdir -p components/shared
mkdir -p components/property
mkdir -p components/tenant
mkdir -p components/reports

# Create lib directories
mkdir -p lib/firebase
mkdir -p lib/utils
mkdir -p lib/hooks
mkdir -p lib/validations

# Create types directory
mkdir -p types

# Create public directories
mkdir -p public/icons

echo "✅ Folder structure created successfully!"
echo "📁 Your TMS project structure is now ready!"
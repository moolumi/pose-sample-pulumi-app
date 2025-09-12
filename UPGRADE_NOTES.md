# Infrastructure Upgrade Notes

## Changes Made

1. **@pulumi/aws**: Upgraded from ^6.0.0 to ^7.0.0
   - This brings the latest AWS provider features and improvements
   - Ensures compatibility with the latest AWS services and APIs

2. **Lambda Runtime**: Updated from Node.js 18.x to Node.js 20.x
   - Node.js 20.x provides better performance and security
   - Ensures compatibility with the latest Node.js features

## Dependencies

The package-lock.json will be automatically regenerated when Pulumi runs with the new dependency versions. This ensures all transitive dependencies are updated to compatible versions.

## Validation

Run `pulumi preview` to validate that all changes work correctly before deployment.
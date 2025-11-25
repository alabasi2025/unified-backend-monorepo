#!/usr/bin/env python3
"""
Script to remove Smart Notebook related models from Prisma schema
"""

import re

def remove_models(schema_content, models_to_remove):
    """Remove specified models from Prisma schema"""
    lines = schema_content.split('\n')
    result = []
    skip = False
    model_depth = 0
    
    for line in lines:
        # Check if we're starting a model to remove
        for model_name in models_to_remove:
            if re.match(rf'^model\s+{model_name}\s*{{', line):
                skip = True
                model_depth = 0
                break
        
        if skip:
            # Count braces to know when model ends
            model_depth += line.count('{')
            model_depth -= line.count('}')
            
            # If we've closed all braces, model is complete
            if model_depth == 0:
                skip = False
            continue
        
        result.append(line)
    
    return '\n'.join(result)

# Read schema
with open('schema.prisma', 'r', encoding='utf-8') as f:
    schema = f.read()

# Models to remove
models_to_remove = [
    'NotebookPage',
    'StickyNote',
    'TimelineEvent',
    'Notebook',
    'Section'
]

# Remove models
new_schema = remove_models(schema, models_to_remove)

# Write back
with open('schema.prisma', 'w', encoding='utf-8') as f:
    f.write(new_schema)

print("✅ Smart Notebook models removed successfully")
print(f"Models removed: {', '.join(models_to_remove)}")

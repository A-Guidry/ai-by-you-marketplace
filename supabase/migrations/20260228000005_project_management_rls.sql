-- Add missing UPDATE and DELETE policies for developers to manage their own projects

CREATE POLICY "Developers can update their own projects" ON projects 
FOR UPDATE TO authenticated 
USING (developer_id = auth.uid());

CREATE POLICY "Developers can delete their own projects" ON projects 
FOR DELETE TO authenticated 
USING (developer_id = auth.uid());

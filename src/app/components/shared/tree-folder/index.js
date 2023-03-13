import React from 'react';
import { List } from 'semantic-ui-react';
import excels from 'app/assets/excels';

const TreeFolder = () => {
  const handleClick = (file) => {
    const link = document.createElement('a');
    link.href = file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <List>
      {excels.map((level1) => (
        <List.Item key={level1.name}>
          <List.Icon name="folder" />
          <List.Content>
            <List.Header content={level1.name} />
            <List.List>
              {level1.folders.map((level2) => (
                <List.Item key={`${level1.name}-${level2.name}`}>
                  <List.Icon name="folder outline" />
                  <List.Content>
                    <List.Header content={level2.name} />
                    <List.List>
                      {level2.files.map((level3) => (
                        <List.Item
                          as="a"
                          active
                          disabled={!level3.enable}
                          key={`${level1.name}-${level2.name}-${level3.name}`}
                          onClick={() => handleClick(level3.file)}
                        >
                          <List.Icon name="file outline" />
                          <List.Content>
                            <List.Header content={level3.name} />
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.List>
                  </List.Content>
                </List.Item>
              ))}
            </List.List>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default TreeFolder;

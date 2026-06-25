import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Command } from 'cmdk';
import { Building2, ChartNoAxesCombined, GitCompare, Landmark, Search, Terminal } from 'lucide-react';
import { PROPERTIES } from '../../lib/portfolioData';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const propertyCommands = useMemo(() => PROPERTIES.map((property) => ({
    label: property.name,
    sub: `${property.tag} · ${property.location}`,
    value: `open ${property.name} ${property.location}`,
    action: () => navigate(`/portfolio/${property.id}`),
  })), [navigate]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('astute-command-open', onOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('astute-command-open', onOpen);
    };
  }, []);

  const run = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="presentation"
          onMouseDown={() => setOpen(false)}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(3,8,20,0.48)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 92,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.975, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, scale: 0.985, filter: 'blur(8px)' }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Command
              onMouseDown={(event) => event.stopPropagation()}
              className="astute-command"
              label="Astute command palette"
            >
              <div className="astute-command-input-wrap">
                <Search size={17} color="rgba(246,240,228,0.45)" />
                <Command.Input autoFocus placeholder="Search commands, markets, properties..." />
                <span>ESC</span>
              </div>
              <Command.List>
                <Command.Empty>No command found.</Command.Empty>

                <Command.Group heading="Navigation">
                  {[
                    { label: 'Go to Portfolio', icon: Building2, action: () => navigate('/portfolio') },
                    { label: 'Go to Strategy', icon: ChartNoAxesCombined, action: () => navigate('/strategy') },
                    { label: 'Go to Insights', icon: Terminal, action: () => navigate('/insights') },
                    { label: 'Open Underwriting Lab', icon: ChartNoAxesCombined, action: () => navigate('/strategy') },
                    { label: 'Open Market Terminal', icon: Terminal, action: () => navigate('/insights') },
                    { label: 'Future: Open Assets Dashboard', icon: Landmark, action: () => navigate('/portfolio') },
                  ].map(({ label, icon: Icon, action }) => (
                    <Command.Item key={label} value={label} onSelect={() => run(action)}>
                      <Icon size={15} />
                      <span>{label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Deals">
                  <Command.Item value="Compare deals" onSelect={() => run(() => navigate('/portfolio'))}>
                    <GitCompare size={15} />
                    <span>Compare deals</span>
                  </Command.Item>
                  <Command.Item value="Search properties" onSelect={() => run(() => navigate('/portfolio'))}>
                    <Search size={15} />
                    <span>Search properties</span>
                  </Command.Item>
                  {propertyCommands.map((command) => (
                    <Command.Item key={command.value} value={command.value} onSelect={() => run(command.action)}>
                      <Building2 size={15} />
                      <span>{command.label}</span>
                      <small>{command.sub}</small>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

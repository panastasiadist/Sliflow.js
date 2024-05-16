import { jest } from '@jest/globals';
import Bus from './Bus';
import Runtime from './Runtime';
import Projector from './Projector';
import Configuration from './Configuration';
import BusInterface from '../../lib/Interfaces/BusInterface';
import RuntimeInterface from '../../lib/Interfaces/RuntimeInterface';
import ProjectorInterface from '../../lib/Interfaces/ProjectorInterface';
import ConfigurationInterface from '../../lib/Interfaces/ConfigurationInterface';

export interface PluginMockBundle {
    bus: BusInterface;
    configuration: ConfigurationInterface;
    projector: ProjectorInterface;
    runtime: RuntimeInterface;
}

export function createPluginMockBundle(
    element: HTMLElement = document.createElement('div'),
    isRTL = false,
    isHorizontal = true,
): PluginMockBundle {
    const bus = new Bus();
    const runtime = new Runtime(element, isRTL, isHorizontal);
    const projector = new Projector(runtime, bus);

    (projector.getRuntime as jest.MockedFunction<() => RuntimeInterface>).mockReturnValue(runtime);

    return {
        bus,
        runtime,
        projector,
        configuration: new Configuration([]),
    };
}

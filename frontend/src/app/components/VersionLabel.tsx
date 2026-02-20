const VersionLabel = () => {
    const version = `v${import.meta.env.PACKAGE_VERSION}`;

    return (
        <div className="fixed bottom-2 right-2 z-9999 pointer-events-none">
            <span
                className="text-sm font-mono text-gray-400 backdrop-blur-sm
                    px-1.5 py-0.5"
            >
                {version}
            </span>
        </div>
    );
};

export default VersionLabel;

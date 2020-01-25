pragma solidity >=0.4.0 <0.7.0;

pragma experimental ABIEncoderV2;

contract Elf {
    
    enum ElfType { Wood, Dark, Normal, High }
    
    event AddingNewElf(
        string name,
        int age,
        ElfType elftype
        );
    
    struct Sword{
        string name;
        int attack;
    }
    
    struct Ring{
        string name;
        int intelligence;
        bool isOneRing;
    }
    
    struct Spell{
        string name;
        string content;
        address owner;
    }
    
    struct  Elf_Identifier{
        string name;
        int age;
        ElfType elftype;
        bool isValue;
    }
    
    Spell[] Spells;
    mapping(address => Elf_Identifier) Elf_Contents;
    mapping(address => Ring[]) Rings;
    mapping(address => Sword[]) Swords;
    
    function checkString(string memory text) private view returns(bool){
        return bytes(text).length != 0;
    }

    function addMe(string memory name, int age) public {
        // require(!Elf_Contents[msg.sender].isValue);
        createElf(name, age);
    }
    
    function addSpell(string memory name, string  memory content) public {
        require(checkString(name));
        require(checkString(content));
        require(Elf_Contents[msg.sender].elftype == ElfType.High);
        Spells.push(Spell(name,content,msg.sender));
        
    }
    function getSpell() public view returns(Spell[] memory){
        return Spells;
    }
    
    function createElf(string memory name, int age) private {
        // require(checkString(name));
        // require(age > 0);
        
        uint256 random_number = random();
        uint256 darknessCheck = random_number % 4;
        ElfType current_type = ElfType(darknessCheck);
        Elf_Contents[msg.sender] = Elf_Identifier(name, age, current_type, true);
        emit AddingNewElf(name, age, current_type);
    }
    
    function random() private view returns (uint256) {
       return uint256(int256(keccak256(abi.encode(block.timestamp, block.difficulty)))%251);
   }
   
    function getElfContent() public view returns(Elf_Identifier memory returnedElf){
        return Elf_Contents[msg.sender];
    }
    
    function changeName(string memory name) public {
        require(checkString(name));
        Elf_Contents[msg.sender].name = name;
    }
    
    function forgeRing(string memory name, int intelligence)  public  {
        require(checkString(name));
        require(intelligence< (10* Elf_Contents[msg.sender].age));
        Rings[msg.sender].push(Ring(name,intelligence, false));
    }
    
    function oneRing2RuleThemAll() public {
        require(Elf_Contents[msg.sender].elftype == ElfType.Dark);
        Rings[msg.sender].push(Ring("One Ring",99999, true));
        
    }
    function getRings() public view returns(Ring[] memory){
        return Rings[msg.sender];
    }
    
}